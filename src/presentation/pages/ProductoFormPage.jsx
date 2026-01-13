// src/presentation/pages/ProductoFormPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import apiClient from '../../infrastructure/http/apiClient';

export default function ProductoFormPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    unidadMedida: '',
    precioReferencia: '',
    stockActual: '',
    estado: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    const isEdit = location.pathname.includes('/editar/');
    setIsEditing(isEdit);

    if (isEdit && id) {
      loadProducto(id);
    }
  }, [location.pathname, id]);

  const loadProducto = async (productId) => {
    try {
      const response = await apiClient.get(`/Producto/${productId}`);
      setForm({
        nombre: response.data.nombre || '',
        unidadMedida: response.data.unidadMedida || '',
        precioReferencia: response.data.precioReferencia?.toString() || '',
        stockActual: response.data.stockActual?.toString() || '',
        estado: response.data.estado ?? true,
      });
    } catch (err) {
      console.error('Error al cargar producto:', err);
      alert('No se pudo cargar el producto.');
      navigate('/productos');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        unidadMedida: form.unidadMedida.trim(),
        precioReferencia: parseFloat(form.precioReferencia),
        stockActual: parseInt(form.stockActual, 10),
        estado: form.estado,
      };

      if (isNaN(payload.precioReferencia) || isNaN(payload.stockActual)) {
        throw new Error('Precio y Stock deben ser números válidos.');
      }

      if (isEditing) {
        await apiClient.put(`/Producto/${id}`, payload);
        alert('✅ Producto actualizado correctamente.');
      } else {
        await apiClient.post('/Producto', payload);
        alert('✅ Producto creado correctamente.');
      }

      navigate('/productos');
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.mensaje || err.message || 'Operación fallida'));
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
          {isEditing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="nombre"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '600',
                color: '#027259',
              }}
            >
              Nombre:
            </label>
            <input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Chaucha"
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Unidad de Medida */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="unidadMedida"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '600',
                color: '#027259',
              }}
            >
              Unidad de Medida:
            </label>
            <input
              id="unidadMedida"
              name="unidadMedida"
              value={form.unidadMedida}
              onChange={handleChange}
              placeholder="Ej: Cajon, Kilo"
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Precio Referencia */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="precioReferencia"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '600',
                color: '#027259',
              }}
            >
              Precio Referencia (S/):
            </label>
            <input
              id="precioReferencia"
              name="precioReferencia"
              type="number"
              step="0.01"
              value={form.precioReferencia}
              onChange={handleChange}
              placeholder="Ej: 23.00"
              required
              min="0"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Stock Actual */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="stockActual"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: '600',
                color: '#027259',
              }}
            >
              Stock Actual:
            </label>
            <input
              id="stockActual"
              name="stockActual"
              type="number"
              value={form.stockActual}
              onChange={handleChange}
              placeholder="Ej: 100"
              required
              min="0"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Estado */}
          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="estado"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                color: '#027259',
              }}
            >
              <input
                id="estado"
                name="estado"
                type="checkbox"
                checked={form.estado}
                onChange={handleChange}
              />
              Activo
            </label>
          </div>

          {/* Botones con tus colores favoritos */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: loading 
                  ? '#ccc' 
                  : isEditing 
                    ? '#FFA500'   // 🟠 Naranja para "Actualizar"
                    : '#4CAF50',  // 🟢 Verde para "Crear"
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/productos')}
              style={{
                flex: 1,
                backgroundColor: '#f44336', // 🔴 Rojo para "Cancelar"
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
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