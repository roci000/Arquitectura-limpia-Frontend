import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import apiClient from '../../infrastructure/http/apiClient';

export default function EmpleadoFormPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    cargo: '',
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
      loadEmpleado(id);
    }
  }, [location.pathname, id]);

  const loadEmpleado = async (empleadoId) => {
    try {
      const response = await apiClient.get(`/Empleado/${empleadoId}`);
      setForm({
        nombre: response.data.nombre || '',
        apellido: response.data.apellido || '',
        cargo: response.data.cargo || '',
        estado: response.data.estado ?? true,
      });
    } catch (err) {
      console.error('Error al cargar empleado:', err);
      alert('No se pudo cargar el empleado.');
      navigate('/empleados');
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
        apellido: form.apellido.trim(),
        cargo: form.cargo.trim() || null,
        estado: form.estado,
      };

      if (isEditing) {
        await apiClient.put(`/Empleado/${id}`, payload);
        alert('Empleado actualizado correctamente.');
      } else {
        await apiClient.post('/Empleado', payload);
        alert('Empleado creado correctamente.');
      }

      navigate('/empleados');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.mensaje || err.message || 'Operación fallida'));
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
          {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="nombre" style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#027259' }}>
              Nombre:
            </label>
            <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Juan" required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="apellido" style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#027259' }}>
              Apellido:
            </label>
            <input id="apellido" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Ej: Pérez" required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="cargo" style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#027259' }}>
              Cargo:
            </label>
            <input id="cargo" name="cargo" value={form.cargo} onChange={handleChange} placeholder="Opcional" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="estado" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#027259' }}>
              <input id="estado" name="estado" type="checkbox" checked={form.estado} onChange={handleChange} />
              Activo
            </label>
          </div>

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
              onClick={() => navigate('/empleados')}
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