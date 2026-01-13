// src/presentation/components/layout/Sidebar.jsx
import { Link } from 'react-router-dom';

export default function Sidebar({ collapsed, onToggle }) {
  const modules = [
    { name: 'Ventas', path: '/ventas' },
    { name: 'Ingresos', path: '/ingresos' },
    { name: 'Productos', path: '/productos' },
    { name: 'Clientes', path: '/clientes' },
    { name: 'Proveedores', path: '/proveedores' },
    { name: 'Empleados', path: '/empleados' },
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
            Sistema de Gestión
            <span style={{ marginRight: '20px' }}>X</span>
          </>
        )}
      </div>

      <nav style={{ flex: 1 }}>
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
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0D9853'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {!collapsed && mod.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}