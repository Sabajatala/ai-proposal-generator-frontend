import { useAuth } from '../context/AuthContext';
import { Link, Outlet, useLocation } from 'react-router-dom';

const menuItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/company-profile', label: 'Company Profile' },
  { to: '/create-proposal', label: 'New Proposal' },
  { to: '/proposals', label: 'All Proposals' },
  
  

  
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: '#1e293b',
        color: 'white',
        padding: '1.5rem',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ color: '#60a5fa', marginBottom: '2rem' }}>AI Proposal-Generator</h3>

        <nav>
          {menuItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'block',
                padding: '0.75rem 1rem',
                color: pathname === item.to ? '#60a5fa' : 'white',
                textDecoration: 'none',
                marginBottom: '0.5rem',
                borderRadius: '0.5rem',
                background: pathname === item.to ? '#334155' : 'transparent'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ position: 'absolute', bottom: '1.5rem', width: '200px' }}>
          <button
            onClick={signOut}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '1.5rem' }}>
        <header style={{
          background: 'white',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.5rem' }}>Welcome, {user?.email?.split('@')[0] || 'Admin'}</h1>
          <div style={{ color: '#64748b' }}>{new Date().toLocaleDateString()}</div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}