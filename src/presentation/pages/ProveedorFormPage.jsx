// src/presentation/pages/ProveedorFormPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import apiClient from '../../infrastructure/http/apiClient';

export default function ProveedorFormPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
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
      loadProveedor(id);
    }
  }, [location.pathname, id]);

  const loadProveedor = async (proveedorId) => {
    try {
      const response = await apiClient.get(`/Proveedor/${proveedorId}`);
      setForm({
        nombre: response.data.nombre || '',
        telefono: response.data.telefono || '',
        direccion: response.data.direccion || '',
        estado: response.data.estado ?? true,
      });
    } catch (err) {
      console.error('Error al cargar proveedor:', err);
      alert('No se pudo cargar el proveedor.');
      navigate('/proveedores');
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
        telefono: form.telefono.trim() || null,
        direccion: form.direccion.trim(),
        estado: form.estado,
      };

      if (isEditing) {
        await apiClient.put(`/Proveedor/${id}`, payload);
        alert('✅ Proveedor actualizado correctamente.');
      } else {
        await apiClient.post('/Proveedor', payload);
        alert('✅ Proveedor creado correctamente.');
      }

      navigate('/proveedores');
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
          {isEditing ? '✏️ Editar Proveedor' : '➕ Nuevo Proveedor'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="nombre" style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#027259' }}>
              Nombre:
            </label>
            <input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Distribuidora ABC"
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          {/* Teléfono */}
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="telefono" style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#027259' }}>
              Teléfono:
            </label>
            <input
              id="telefono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Opcional"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          {/* Dirección */}
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="direccion" style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#027259' }}>
              Dirección:
            </label>
            <input
              id="direccion"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Ej: Av. Siempre Viva 123"
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          {/* Estado */}
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="estado" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#027259' }}>
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

          {/* Botones con tus colores */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: loading ? '#ccc' : isEditing ? '#FFA500' : '#4CAF50',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/proveedores')}
              style={{
                flex: 1,
                backgroundColor: '#f44336',
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