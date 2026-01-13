import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import apiClient from '../../infrastructure/http/apiClient';

export default function VentaListPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [clientesMap, setClientesMap] = useState({});
  const [empleadosMap, setEmpleadosMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cliRes, empRes, ventasRes] = await Promise.all([
          apiClient.get('/Cliente'),
          apiClient.get('/Empleado'),
          apiClient.get('/Venta')
        ]);

        const cliMap = {};
        (cliRes.data || []).forEach(c => cliMap[c.id] = c.nombreCompleto);
        setClientesMap(cliMap);

        const empMap = {};
        (empRes.data || []).forEach(e => empMap[e.id] = `${e.nombre} ${e.apellido}`);
        setEmpleadosMap(empMap);

        setVentas(ventasRes.data || []);
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
        const response = await apiClient.get('/Venta');
        setVentas(response.data || []);
      } catch (err) {
        console.error('Error al cargar ventas:', err);
      alert('No se pudo cargar el ventas.');
      }
      return;
    }

    try {
      const response = await apiClient.get(`/Venta/${searchId.trim()}`);
      setVentas([response.data]);
    } catch (err) {
      if (err.response?.status === 404) {
        alert('Venta no encontrada.');
        setVentas([]);
      } else {
        alert('Error al buscar venta.');
      }
    }
  };

  const handleAnular = async (id) => {
    const motivo = prompt('Ingrese el motivo de anulación:');
    if (!motivo) return;
    try {
      await apiClient.post(`/Venta/${id}/anular`, motivo);
      alert('Venta anulada. El stock ha sido restaurado.');
      const response = await apiClient.get('/Venta');
      setVentas(response.data || []);
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
        style={{ marginLeft: sidebarCollapsed ? '60px' : '220px', padding: '30px', width: sidebarCollapsed ? 'calc(100% - 60px)' : 'calc(100% - 220px)', transition: 'margin-left 0.3s ease',}}>
        <h1 style={{ fontSize: '1.8rem', color: '#027259', fontWeight: '600', marginBottom: '20px' }}>
          Gestión de Ventas
        </h1>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="Buscar por ID (GUID completo)" value={searchId} onChange={(e) => setSearchId(e.target.value)} style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}/>
          <button
            onClick={handleSearchById}
            style={{ backgroundColor: '#027259', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer',
            }}
          >
            Buscar
          </button>
          <button
            onClick={() => {
              setSearchId('');
              apiClient.get('/Venta').then(res => setVentas(res.data || []));
            }}
            style={{ backgroundColor: '#6c757d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer',
            }}
          >
            Ver Todos
          </button>
        </div>

        <button
          onClick={() => navigate('/ventas/nuevo')}
          style={{ marginBottom: '20px', backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer',
          }}
        >
          + Nueva Venta
        </button>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#E8F5E9' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Empleado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Fecha</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Monto Total</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Anulado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length > 0 ? (
                ventas.map((v) => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontSize: '0.85rem', wordBreak: 'break-all' }}>{v.id}</td>
                    <td style={{ padding: '12px' }}>{clientesMap[v.clienteId] || v.clienteId}</td>
                    <td style={{ padding: '12px' }}>{empleadosMap[v.empleadoId] || v.empleadoId}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {new Date(v.fechaVenta).toLocaleDateString('es-PE')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{v.montoTotal.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{v.anulado ? 'Sí' : 'No'}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {!v.anulado && (
                        <button
                          onClick={() => handleAnular(v.id)}
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
                    No hay ventas.
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