import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const styles = {
  nav: { background: '#fff', borderBottom: '1px solid #E5EDE9', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: '#1D9E75', display: 'flex', alignItems: 'center', gap: '8px' },
  links: { display: 'flex', gap: '8px', alignItems: 'center' },
  link: { padding: '6px 14px', borderRadius: '8px', fontSize: '14px', color: '#6b8c7a', fontWeight: 500, transition: 'all 0.15s' },
  activeLink: { background: '#E1F5EE', color: '#085041' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#085041' },
  logoutBtn: { padding: '6px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid #E5EDE9', background: 'transparent', color: '#6b8c7a', cursor: 'pointer' }
};

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>💚 MindEase</div>
      <div style={styles.links}>
        {[{ path: '/dashboard', label: 'Home' }, { path: '/chat', label: 'Chat' }, { path: '/mood', label: 'Mood' }].map(({ path, label }) => (
          <Link key={path} to={path} style={{ ...styles.link, ...(isActive(path) ? styles.activeLink : {}) }}>{label}</Link>
        ))}
      </div>
      <div style={styles.userBadge}>
        <div style={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
        <span style={{ fontSize: '14px', color: '#1a2e25' }}>{user.name}</span>
        <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
