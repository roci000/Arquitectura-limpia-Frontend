// src/presentation/pages/ProductoPage.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import apiClient from '../../infrastructure/http/apiClient';

export default function ProductoPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: '',
    unidadMedida: '',
    precioReferencia: '',
    stockActual: '',
    estado: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchId, setSearchId] = useState('');

  // Cargar todos los productos al inicio
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await apiClient.get('/Producto');
      setProductos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      alert('No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: form.nombre,
        unidadMedida: form.unidadMedida,
        precioReferencia: parseFloat(form.precioReferencia),
        stockActual: parseInt(form.stockActual, 10),
        estado: form.estado,
      };

      if (editingId) {
        await apiClient.put(`/Producto/${editingId}`, payload);
        alert('Producto actualizado correctamente.');
      } else {
        await apiClient.post('/Producto', payload);
        alert('Producto creado correctamente.');
      }

      // Recargar lista
      await fetchProductos();
      // Reset formulario
      setForm({
        nombre: '',
        unidadMedida: '',
        precioReferencia: '',
        stockActual: '',
        estado: true,
      });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error en operación:', err);
      alert('Error: ' + (err.response?.data?.mensaje || err.message || 'Operación fallida'));
    }
  };

  const handleEdit = (producto) => {
    setForm({
      nombre: producto.nombre,
      unidadMedida: producto.unidadMedida,
      precioReferencia: producto.precioReferencia.toString(),
      stockActual: producto.stockActual.toString(),
      estado: producto.estado,
    });
    setEditingId(producto.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await apiClient.delete(`/Producto/${id}`);
      alert('Producto eliminado.');
      await fetchProductos();
    } catch (err) {
      alert('Error al eliminar: ' + (err.response?.data?.mensaje || 'Falló'));
    }
  };

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      fetchProductos(); // Si borran el campo, muestran todos
      return;
    }
    try {
      const response = await apiClient.get(`/Producto/${searchId.trim()}`);
      setProductos([response.data]); // Mostrar solo ese producto
    } catch (err) {
      if (err.response?.status === 404) {
        alert('Producto no encontrado.');
        setProductos([]);
      } else {
        alert('Error al buscar producto.');
        console.error(err);
      }
    }
  };

  // Filtrado local (opcional): si prefieres filtrar del lado del cliente cuando ya tienes todos los datos
  // Pero aquí usamos búsqueda por API para ser más eficiente

  const displayedProductos = productos;

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
        <h1
          style={{
            fontSize: '1.8rem',
            color: '#027259',
            fontWeight: '600',
            marginBottom: '20px',
          }}
        >
          Gestión de Productos
        </h1>

        {/* Búsqueda por ID */}
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
            onClick={fetchProductos}
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

        {/* Botón Nuevo */}
        <button
          onClick={() => {
            setForm({
              nombre: '',
              unidadMedida: '',
              precioReferencia: '',
              stockActual: '',
              estado: true,
            });
            setEditingId(null);
            setShowForm(true);
          }}
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
          + Nuevo Producto
        </button>

        {/* Formulario (Crear/Editar) */}
        {showForm && (
          <div
            style={{
              marginBottom: '24px',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ marginBottom: '16px' }}>
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleInputChange}
                placeholder="Nombre"
                required
                style={{
                  display: 'block',
                  width: '100%',
                  marginBottom: '10px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <input
                name="unidadMedida"
                value={form.unidadMedida}
                onChange={handleInputChange}
                placeholder="Unidad de Medida"
                required
                style={{
                  display: 'block',
                  width: '100%',
                  marginBottom: '10px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <input
                name="precioReferencia"
                type="number"
                step="0.01"
                value={form.precioReferencia}
                onChange={handleInputChange}
                placeholder="Precio de Referencia"
                required
                min="0"
                style={{
                  display: 'block',
                  width: '100%',
                  marginBottom: '10px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <input
                name="stockActual"
                type="number"
                value={form.stockActual}
                onChange={handleInputChange}
                placeholder="Stock Actual"
                required
                min="0"
                style={{
                  display: 'block',
                  width: '100%',
                  marginBottom: '10px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <input
                  name="estado"
                  type="checkbox"
                  checked={form.estado}
                  onChange={handleInputChange}
                />
                Activo
              </label>
              <div>
                <button
                  type="submit"
                  style={{
                    marginRight: '8px',
                    backgroundColor: editingId ? '#FFA500' : '#4CAF50',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de Productos */}
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#E8F5E9' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Unidad</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Precio</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Stock</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayedProductos.length > 0 ? (
                displayedProductos.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                      {p.id}
                    </td>
                    <td style={{ padding: '12px' }}>{p.nombre}</td>
                    <td style={{ padding: '12px' }}>{p.unidadMedida}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {typeof p.precioReferencia === 'number'
                        ? p.precioReferencia.toFixed(2)
                        : p.precioReferencia}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{p.stockActual}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {p.estado ? 'Activo' : 'Inactivo'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(p)}
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
                  <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No hay productos para mostrar.
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