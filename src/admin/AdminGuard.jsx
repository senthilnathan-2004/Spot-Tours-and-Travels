import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { api } from './utils/api.js';

export default function AdminGuard() {
  const [status, setStatus] = useState('loading'); // loading | ok | denied
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    api.me()
      .then(data => { setAdmin(data.admin); setStatus('ok'); })
      .catch(() => setStatus('denied'));
  }, []);

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0f172a', flexDirection: 'column', gap: 16
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '3px solid rgba(56,189,248,0.3)', borderTopColor: '#38bdf8',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
        <p style={{ color: '#64748b', fontFamily: 'Inter,sans-serif', fontSize: '0.9rem' }}>
          Authenticating…
        </p>
      </div>
    );
  }

  if (status === 'denied') return <Navigate to="/admin/login" replace />;

  // Pass admin context through context or just let child routes access via prop
  return <Outlet context={{ admin }} />;
}
