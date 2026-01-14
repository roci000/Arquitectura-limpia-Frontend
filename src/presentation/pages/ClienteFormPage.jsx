import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import apiClient from '../../infrastructure/http/apiClient';

export default function ClienteFormPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [form, setForm] = useState({
    nombreCompleto: '',
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
    if (isEdit && id) loadCliente(id);
  }, [location.pathname, id]);

  const loadCliente = async (clienteId) => {
    try {
      const response = await apiClient.get(`/Cliente/${clienteId}`);
      setForm({
        nombreCompleto: response.data.nombreCompleto || '',
        telefono: response.data.telefono || '',
        direccion: response.data.direccion || '',
        estado: response.data.estado ?? true,
      });
    } catch (err) {
      alert('No se pudo cargar el cliente.', err);
      navigate('/clientes');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        nombreCompleto: form.nombreCompleto.trim(),
        telefono: form.telefono.trim() || null,
        direccion: form.direccion.trim() || null,
        estado: form.estado,
      };
      if (isEditing) {
        await apiClient.put(`/Cliente/${id}`, payload);
        alert('Cliente actualizado correctamente.');
      } else {
        await apiClient.post('/Cliente', payload);
        alert('Cliente creado correctamente.');
      }
      navigate('/clientes');
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Operación fallida';
      alert('Error: ' + mensaje);
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
          {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="nombreCompleto" style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#027259' }}>Nombre Completo:</label>
          <input id="nombreCompleto" name="nombreCompleto" value={form.nombreCompleto} onChange={handleChange} placeholder="Ej: María López" required style={{ width: '100%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px' }} />

          <label htmlFor="telefono" style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#027259' }}>Teléfono (8 dígitos):</label>
          <input id="telefono" name="telefono" type="text" value={form.telefono} onChange={handleChange} placeholder="Opcional" style={{ width: '100%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px' }} />

          <label htmlFor="direccion" style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#027259' }}>Dirección:</label>
          <input id="direccion" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Opcional" style={{ width: '100%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px' }} />

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#027259', marginBottom: '24px' }}>
            <input name="estado" type="checkbox" checked={form.estado} onChange={handleChange} /> Activo
          </label>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading} style={{ flex: 1, backgroundColor: loading ? '#ccc' : isEditing ? '#FFA500' : '#4CAF50', color: 'white', padding: '10px 16px', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" onClick={() => navigate('/clientes')} style={{ flex: 1, backgroundColor: '#f44336', color: 'white', padding: '10px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}