// src/presentation/pages/VentaPage.jsx
import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';

export default function VentaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
          Gestión de Ventas
        </h1>
        <p>Contenido del módulo de Ventas.</p>
      </main>
    </div>
  );
}