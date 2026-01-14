import { Link } from 'react-router-dom';

export default function Sidebar({ collapsed, onToggle }) {
  const modules = [
    { name: 'Inicio', path: '/', icon: '🏠' },
    { name: 'Ventas', path: '/ventas', icon: '💰' },
    { name: 'Ingresos', path: '/ingresos', icon: '📦' },
    { name: 'Productos', path: '/productos', icon: '📱' },
    { name: 'Clientes', path: '/clientes', icon: '👥' },
    { name: 'Proveedores', path: '/proveedores', icon: '🏭' },
    { name: 'Empleados', path: '/empleados', icon: '👔' },
  ];

  return (
    <div style={{
      width: collapsed ? '60px' : '220px',
      backgroundColor: '#027259',
      borderRight: '1px solid #0D9853',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      padding: '16px 0',
      overflowY: 'auto',
      transition: 'width 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px',
          cursor: 'pointer',
          color: '#FFFFFF',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          justifyContent: 'space-between',
          backgroundColor: '#027259',
          borderRadius: '0',
          border: 'none'
        }}
        title={collapsed ? 'Expandir menú' : 'Contraer menú'}
      >
        {collapsed ? (
          <span>☰</span>
        ) : (
          <>
            <img 
              src="/assets/verduras.png" 
              alt="Verduras" 
              style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '4px' }} 
            />
            Sistema de Gestión
            <span style={{ marginRight: '20px' }}>X</span>
          </>
        )}
      </div>

      <nav style={{ flex: 1, paddingTop: '20px' }}>
        {modules.map((mod) => (
          <Link
            key={mod.path}
            to={mod.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              textDecoration: 'none',
              color: '#FFFFFF',
              fontSize: '1rem',
              transition: 'background 0.2s, color 0.2s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              gap: '12px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0D9853'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>{mod.icon}</span>
            {!collapsed && mod.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}