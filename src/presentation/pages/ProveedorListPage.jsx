import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import apiClient from '../../infrastructure/http/apiClient';

export default function ProveedorListPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await apiClient.get('/Proveedor');
      setProveedores(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
      alert('No se pudieron cargar los proveedores.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      fetchProveedores();
      return;
    }
    try {
      const response = await apiClient.get(`/Proveedor/${searchId.trim()}`);
      setProveedores([response.data]);
    } catch (err) {
      if (err.response?.status === 404) {
        alert('Proveedor no encontrado.');
        setProveedores([]);
      } else {
        alert('Error al buscar proveedor.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este proveedor?')) return;
    try {
      await apiClient.delete(`/Proveedor/${id}`);
      alert('Proveedor eliminado.');
      fetchProveedores();
    } catch (err) {
      alert('Error al eliminar: ' + (err.response?.data?.mensaje || 'Falló'));
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#C9F6BC', minHeight: '100vh' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        style={{
          marginLeft: sidebarCollapsed ? '60px' : '220px',
          padding: '30px',
          width: sidebarCollapsed ? 'calc(100% - 60px)' : 'calc(100% - 220px)',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <h1 style={{ fontSize: '1.8rem', color: '#027259', fontWeight: '600', marginBottom: '20px' }}>
          Gestión de Proveedores
        </h1>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Buscar por ID (GUID completo)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={handleSearchById}
            style={{
              backgroundColor: '#027259',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Buscar
          </button>
          <button
            onClick={fetchProveedores}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Ver Todos
          </button>
        </div>

        <button
          onClick={() => navigate('/proveedores/nuevo')}
          style={{
            marginBottom: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          + Nuevo Proveedor
        </button>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#E8F5E9' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Teléfono</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Dirección</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.length > 0 ? (
                proveedores.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontSize: '0.85rem', wordBreak: 'break-all' }}>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{p.telefono || '—'}</td>
                    <td>{p.direccion}</td>
                    <td style={{ textAlign: 'center' }}>{p.estado ? 'Activo' : 'Inactivo'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => navigate(`/proveedores/editar/${p.id}`)}
                        style={{
                          marginRight: '6px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>
                    No hay proveedores.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}