// src/presentation/pages/DashboardPage.jsx
import { useState } from 'react';
import ModuleCard from '../components/ui/ModuleCard';
import Sidebar from '../components/layout/Sidebar';

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const modules = [
    { title: 'Ventas', icon: '💰', path: '/ventas' },
    { title: 'Ingresos', icon: '📦', path: '/ingresos' },
    { title: 'Productos', icon: '📱', path: '/productos' },
    { title: 'Clientes', icon: '👥', path: '/clientes' },
    { title: 'Proveedores', icon: '🏭', path: '/proveedores' },
    { title: 'Empleados', icon: '👔', path: '/empleados' },
  ];

  return (
    <div style={{ display: 'flex', backgroundColor: '#C9F6BC', minHeight: '100vh' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main style={{
        marginLeft: sidebarCollapsed ? '60px' : '220px',
        padding: '30px',
        width: sidebarCollapsed ? 'calc(100% - 60px)' : 'calc(100% - 220px)',
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease, width 0.3s ease'
      }}>
        <h1 style={{ 
          fontSize: '1.8rem', 
          marginBottom: '24px', 
          color: '#027259',
          fontWeight: '600'
        }}>
          Bienvenido al Sistema de Gestión
        </h1>
        <p style={{ 
          marginBottom: '30px', 
          color: '#027259',
          opacity: 0.8
        }}>
          Selecciona un módulo para comenzar.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '24px',
          maxWidth: '1000px'
        }}>
          {modules.map((mod) => (
            <ModuleCard
              key={mod.path}
              title={mod.title}
              icon={mod.icon}
              to={mod.path}
            />
          ))}
        </div>
      </main>
    </div>
  );
}