import { Link } from 'react-router-dom';

export default function ModuleCard({ title, icon, to }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: 'none',
        color: '#027259',
        display: 'block',
        textAlign: 'center',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#F1FFD8',
        boxShadow: '0 2px 8px rgba(2, 114, 89, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        border: '1px solid #0D9853',
        fontWeight: '600'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 114, 89, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(2, 114, 89, 0.1)';
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontSize: '1.1rem' }}>{title}</div>
    </Link>
  );
}