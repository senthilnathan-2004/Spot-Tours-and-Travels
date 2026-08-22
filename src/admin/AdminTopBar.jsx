import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  MdMenu,
  MdOutlineLaunch
} from 'react-icons/md';
import AdminSearch from './components/AdminSearch.jsx';
import AdminNotifications from './components/AdminNotifications.jsx';
import AdminUserMenu from './components/AdminUserMenu.jsx';
import './AdminTopBar.css';

const ROUTE_META = {
  '/admin': {
    eyebrow: 'OVERVIEW',
    title: 'Dashboard',
    description: 'Live performance, bookings & enquiries monitoring'
  },
  '/admin/dashboard': {
    eyebrow: 'OVERVIEW',
    title: 'Dashboard',
    description: 'Live performance, bookings & enquiries monitoring'
  },
  '/admin/packages': {
    eyebrow: 'CATALOG',
    title: 'Tour Packages',
    description: 'Manage travel packages, pricing & itineraries'
  },
  '/admin/bookings': {
    eyebrow: 'RESERVATIONS',
    title: 'Customer Bookings',
    description: 'Review, confirm and manage customer tour bookings'
  },
  '/admin/enquiries': {
    eyebrow: 'LEADS & MESSAGES',
    title: 'Enquiries & Leads',
    description: 'Manage and respond to incoming customer queries'
  },
  '/admin/content': {
    eyebrow: 'CMS',
    title: 'Site Content',
    description: 'Customize homepage banners, headlines & announcements'
  },
  '/admin/team': {
    eyebrow: 'ACCESS CONTROL',
    title: 'Team & Admins',
    description: 'Manage administrator accounts & system permissions'
  }
};

export default function AdminTopBar({
  admin,
  onMenuClick,
  notifCounts = { bookings: 0, enquiries: 0 }
}) {
  const location = useLocation();
  const currentMeta = ROUTE_META[location.pathname] || {
    eyebrow: 'ADMINISTRATION',
    title: 'Spot Tours Admin',
    description: 'Fleet & Travel Management Console'
  };

  return (
    <header className="adm-topbar" aria-label="Admin Header">
      {/* ── LEFT AREA ── */}
      <div className="adm-topbar-left">
        <button
          type="button"
          className="adm-topbar-toggle-btn"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <MdMenu />
        </button>

        <div className="adm-topbar-headings">
          <div className="adm-topbar-eyebrow-row">
            <span className="adm-topbar-eyebrow">{currentMeta.eyebrow}</span>
          </div>
          <h1 className="adm-topbar-title">{currentMeta.title}</h1>
        </div>
      </div>

      {/* ── CENTER AREA (Global Search) ── */}
      <div className="adm-topbar-center">
        <AdminSearch />
      </div>

      {/* ── RIGHT AREA (Actions & Profile) ── */}
      <div className="adm-topbar-right">
        {/* Live Website Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="adm-header-btn adm-header-btn-ghost"
          title="Open live website in new tab"
        >
          <MdOutlineLaunch className="adm-btn-icon-svg" />
          <span className="adm-btn-text">Live Site</span>
        </a>

        {/* Notifications Popover */}
        <AdminNotifications notifCounts={notifCounts} />

        {/* User Profile Menu */}
        <AdminUserMenu admin={admin} variant="header" />
      </div>
    </header>
  );
}
