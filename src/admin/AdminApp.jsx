import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminTopBar from './AdminTopBar.jsx';
import { api } from './utils/api.js';
import './admin.css';

export default function AdminApp() {
  const ctx = useOutletContext();
  const admin = ctx?.admin;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifCounts, setNotifCounts] = useState({ bookings: 0, enquiries: 0 });

  // Fetch notification counts periodically
  useEffect(() => {
    async function fetchCounts() {
      try {
        const [bs, es] = await Promise.all([api.getBookingStats(), api.getEnquiryStats()]);
        setNotifCounts({ bookings: bs.pending || 0, enquiries: es.new || 0 });
      } catch {}
    }
    fetchCounts();
    const iv = setInterval(fetchCounts, 60000); // every 60s
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="adm-root">
      <div className="adm-layout">
        <AdminSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          admin={admin}
          notifCounts={notifCounts}
        />
        <div className={`adm-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
          <AdminTopBar
            admin={admin}
            onMenuClick={() => setMobileOpen(o => !o)}
            notifCounts={notifCounts}
          />
          <main className="adm-page-content">
            <Outlet context={{ admin, notifCounts }} />
          </main>
        </div>
      </div>
    </div>
  );
}
