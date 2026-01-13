import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import apiClient from '../../infrastructure/http/apiClient';

export default function EmpleadoListPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await apiClient.get('/Empleado');
      setEmpleados(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
      alert('No se pudieron cargar los empleados.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      fetchEmpleados();
      return;
    }
    try {
      const response = await apiClient.get(`/Empleado/${searchId.trim()}`);
      setEmpleados([response.data]);
    } catch (err) {
      if (err.response?.status === 404) {
        alert('Empleado no encontrado.');
        setEmpleados([]);
      } else {
        alert('Error al buscar empleado.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este empleado?')) return;
    try {
      await apiClient.delete(`/Empleado/${id}`);
      alert('Empleado eliminado.');
      fetchEmpleados();
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
          Gestión de Empleados
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
            onClick={fetchEmpleados}
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
          onClick={() => navigate('/empleados/nuevo')}
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
          + Nuevo Empleado
        </button>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#E8F5E9' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Apellido</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Cargo</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.length > 0 ? (
                empleados.map((e) => (
                  <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontSize: '0.85rem', wordBreak: 'break-all' }}>{e.id}</td>
                    <td>{e.nombre}</td>
                    <td>{e.apellido}</td>
                    <td>{e.cargo || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{e.estado ? 'Activo' : 'Inactivo'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => navigate(`/empleados/editar/${e.id}`)}
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
                        onClick={() => handleDelete(e.id)}
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
                    No hay empleados.
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