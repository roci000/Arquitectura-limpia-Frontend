import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import apiClient from '../../infrastructure/http/apiClient';

export default function IngresoFormPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [proveedores, setProveedores] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  const [form, setForm] = useState({
    proveedorId: '',
    empleadoId: '',
  });

  const [detalles, setDetalles] = useState([
    { productoId: '', cantidad: '', precioUnitario: '' }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [provRes, empRes, prodRes] = await Promise.all([
          apiClient.get('/Proveedor'),
          apiClient.get('/Empleado'),
          apiClient.get('/Producto')
        ]);
        setProveedores(provRes.data || []);
        setEmpleados(empRes.data || []);
        setProductos(prodRes.data || []);
      } catch (err) {
        alert('Error al cargar datos maestros.');
        console.error(err);
      }
    };
    loadData();
  }, []);

  const calcularMontoTotal = () => {
    return detalles.reduce((total, d) => {
      const cant = parseFloat(d.cantidad) || 0;
      const prec = parseFloat(d.precioUnitario) || 0;
      return total + (cant * prec);
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index][field] = value;
    setDetalles(nuevosDetalles);
  };

  const agregarDetalle = () => {
    setDetalles([...detalles, { productoId: '', cantidad: '', precioUnitario: '' }]);
  };

  const eliminarDetalle = (index) => {
    if (detalles.length > 1) {
      setDetalles(detalles.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload = {
      proveedorId: form.proveedorId,
      empleadoId: form.empleadoId,
      detalles: detalles.map(d => ({
        productoId: d.productoId,
        cantidad: parseFloat(d.cantidad),
        precioUnitario: parseFloat(d.precioUnitario)
      }))
    };

    await apiClient.post('/Ingreso', payload);
    alert('Ingreso registrado correctamente.');
    navigate('/ingresos');

  } catch (err) {
    const mensaje = err.response?.data?.mensaje || 'Error al registrar el ingreso.';
    alert('' + mensaje);
    console.error(err);
  } finally {
    setLoading(false);
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
        <h2 style={{ color: '#027259', marginBottom: '20px' }}>
          ➕ Nuevo Ingreso
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#027259', marginBottom: '16px' }}>Datos del Ingreso</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label htmlFor="proveedorId" style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#027259' }}>
                  Proveedor:
                </label>
                <select id="proveedorId" name="proveedorId" value={form.proveedorId} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} >
                  <option value="">Seleccione...</option>
                  {proveedores.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="empleadoId" style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#027259' }}>
                  Empleado:
                </label>
                <select id="empleadoId" name="empleadoId" value={form.empleadoId} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} >
                  <option value="">Seleccione...</option>
                  {empleados.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#027259' }}>Productos</h3>
              <button type="button" onClick={agregarDetalle} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                + Agregar Producto
              </button>
            </div>

            {detalles.map((detalle, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', marginBottom: '12px', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: '#027259' }}>Producto</label>
                  <select value={detalle.productoId} onChange={(e) => handleDetalleChange(index, 'productoId', e.target.value)} required style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}>
                    <option value="">Seleccione...</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} ({p.unidadMedida})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: '#027259' }}>Cantidad</label>
                  <input type="text" value={detalle.cantidad} onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)} required style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}/>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: '#027259' }}>Precio Unit.</label>
                  <input type="text" value={detalle.precioUnitario} onChange={(e) => handleDetalleChange(index, 'precioUnitario', e.target.value)} required style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}/>
                </div>

                <button
                  type="button"
                  onClick={() => eliminarDetalle(index)}
                  disabled={detalles.length === 1}
                  style={{
                    backgroundColor: detalles.length === 1 ? '#ccc' : '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    width: '32px',
                    height: '32px',
                    cursor: detalles.length === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '6px', textAlign: 'right' }}>
              <strong>Monto Total: S/ {calcularMontoTotal().toFixed(2)}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: loading ? '#ccc' : '#4CAF50',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              {loading ? 'Registrando...' : 'Registrar Ingreso'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/ingresos')}
              style={{
                flex: 1,
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}