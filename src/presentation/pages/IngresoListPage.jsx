import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import apiClient from '../../infrastructure/http/apiClient';

export default function IngresoListPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [proveedoresMap, setProveedoresMap] = useState({});
  const [empleadosMap, setEmpleadosMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [provRes, empRes, ingresosRes] = await Promise.all([
          apiClient.get('/Proveedor'),
          apiClient.get('/Empleado'),
          apiClient.get('/Ingreso')
        ]);

        const provMap = {};
        (provRes.data || []).forEach(p => provMap[p.id] = p.nombre);
        setProveedoresMap(provMap);

        const empMap = {};
        (empRes.data || []).forEach(e => empMap[e.id] = `${e.nombre} ${e.apellido}`);
        setEmpleadosMap(empMap);

        setIngresos(ingresosRes.data || []);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        alert('No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      try {
        const response = await apiClient.get('/Ingreso');
        setIngresos(response.data || []);
      } catch (err) {
      console.error('Error al cargar ingreso:', err);
      alert('No se pudo cargar el ingreso.');
      }
      return;
    }

    try {
      const response = await apiClient.get(`/Ingreso/${searchId.trim()}`);
      setIngresos([response.data]);
    } catch (err) {
      if (err.response?.status === 404) {
        alert('Ingreso no encontrado.');
        setIngresos([]);
      } else {
        alert('Error al buscar ingreso.');
      }
    }
  };

  const handleRegistrarPago = async (id) => {
    if (!window.confirm('¿Registrar pago para este ingreso?')) return;
    try {
      await apiClient.post(`/Ingreso/${id}/pagar`);
      alert('Pago registrado.');
      const response = await apiClient.get('/Ingreso');
      setIngresos(response.data || []);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.mensaje || 'Falló'));
    }
  };

  const handleAnular = async (id) => {
    const motivo = prompt('Ingrese el motivo de anulación:');
    if (!motivo) return;
    try {
      await apiClient.post(`/Ingreso/${id}/anular`, motivo);
      alert('Ingreso anulado.');
      const response = await apiClient.get('/Ingreso');
      setIngresos(response.data || []);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.mensaje || 'Falló'));
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
          Gestión de Ingresos
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
            onClick={() => {
              setSearchId('');
              apiClient.get('/Ingreso').then(res => setIngresos(res.data || []));
            }}
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
          onClick={() => navigate('/ingresos/nuevo')}
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
          + Nuevo Ingreso
        </button>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#E8F5E9' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Proveedor</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Empleado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Fecha</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Monto Total</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Pagado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.length > 0 ? (
                ingresos.map((i) => (
                  <tr key={i.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontSize: '0.85rem', wordBreak: 'break-all' }}>{i.id}</td>
                    <td style={{ padding: '12px' }}>{proveedoresMap[i.proveedorId] || i.proveedorId}</td>
                    <td style={{ padding: '12px' }}>{empleadosMap[i.empleadoId] || i.empleadoId}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {new Date(i.fechaIngreso).toLocaleDateString('es-PE')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{i.montoTotal.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{i.pagado ? 'Sí' : 'No'}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>

                      {!i.pagado && !i.anulado && (
                        <button
                          onClick={() => handleRegistrarPago(i.id)}
                          style={{
                            marginRight: '6px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Pagar
                        </button>
                      )}
                      {!i.anulado && (
                        <button
                          onClick={() => handleAnular(i.id)}
                          style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Anular
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>
                    No hay ingresos.
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