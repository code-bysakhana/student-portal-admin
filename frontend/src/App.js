import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';

import Login                 from './Components/Login';
import Dashboard             from './Components/Dashboard';
import ListStudent           from './Components/ListStudent';
import CreateOrUpdateStudent from './Components/CreateOrUpdateStudent';
import ViewStudent           from './Components/ViewStudent';

/* ── Sidebar ─────────────────────────────────────────────── */
function Sidebar({ username, onLogout }) {
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (footerRef.current && !footerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { icon: '⊞', label: 'Dashboard', path: '/' },
    { icon: '🎓', label: 'Students',  path: '/students' },
  ];

  return (
    <aside className="sp-sidebar">
      <Link to="/" className="sp-sidebar-logo">
        <div className="sp-logo-icon">🎓</div>
        <div className="sp-logo-text">Student<span>Portal</span></div>
      </Link>

      <div className="sp-sidebar-section">
        <div className="sp-sidebar-section-label">Main Menu</div>
        {navItems.map((item) => {
          const isActive = item.path === '/'
            ? loc.pathname === '/'
            : loc.pathname.startsWith(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`sp-nav-link${isActive ? ' active' : ''}`}
            >
              <div className="nav-icon">{item.icon}</div>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="sp-sidebar-footer" ref={footerRef}>
        <button
          className="sp-avatar-btn"
          onClick={() => setOpen((o) => !o)}
          title="Account"
        >
          <div className="sp-user-avatar">
            {username ? username[0].toUpperCase() : 'A'}
          </div>
        </button>

        {open && (
          <div className="sp-user-popup">
            <div className="sp-user-popup-name">
              <div className="sp-user-avatar" style={{ width:32, height:32, fontSize:13 }}>
                {username ? username[0].toUpperCase() : 'A'}
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:'var(--text-primary)' }}>{username || 'Admin'}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>Administrator</div>
              </div>
            </div>
            <div className="sp-user-popup-divider" />
            <button className="sp-user-popup-signout" onClick={onLogout}>
              <span>⎋</span> Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ── Top bar ─────────────────────────────────────────────── */
function TopBar() {
  const loc = useLocation();
  const isAdd      = loc.pathname.startsWith('/add-student');
  const isView     = loc.pathname.startsWith('/view-student');
  const isStudents = loc.pathname === '/students';

  const title = isAdd      ? (loc.pathname.includes('-1') ? 'Add Student' : 'Edit Student')
              : isView     ? 'Student Profile'
              : isStudents ? 'Students'
              : 'Dashboard';

  return (
    <div className="sp-topbar">
      <div className="sp-topbar-left">
        <div className="sp-page-title">{title}</div>
      </div>
      <div className="sp-topbar-right">
        <Link to="/add-student/-1" className="sp-btn-primary">
          + Add Student
        </Link>
      </div>
    </div>
  );
}

/* ── App Shell ───────────────────────────────────────────── */
function AppShell({ username, onLogout }) {
  return (
    <div className="sp-shell">
      <Sidebar username={username} onLogout={onLogout} />
      <div className="sp-main">
        <TopBar />
        <Routes>
          <Route path="/"                 element={<Dashboard />} />
          <Route path="/students"         element={<ListStudent />} />
          <Route path="/add-student/:id"  element={<CreateOrUpdateStudent />} />
          <Route path="/view-student/:id" element={<ViewStudent />} />
          <Route path="*"                 element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

/* ── App root ────────────────────────────────────────────── */
function App() {
  const [username, setUsername] = useState(
    () => localStorage.getItem('sp_auth') || null
  );

  const handleLogin  = (uname) => setUsername(uname);
  const handleLogout = () => {
    localStorage.removeItem('sp_auth');
    setUsername(null);
  };

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <AppShell username={username} onLogout={handleLogout} />
    </Router>
  );
}

export default App;
