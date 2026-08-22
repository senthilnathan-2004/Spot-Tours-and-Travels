import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MdLogout,
  MdKeyboardArrowDown,
  MdShield,
  MdPersonOutline,
  MdOutlineDashboard,
  MdOutlineLaunch
} from 'react-icons/md';
import { api } from '../utils/api.js';

export default function AdminUserMenu({ admin, variant = 'header', onNavigate }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  const name = admin?.name || 'Senthil Nathan';
  const email = admin?.email || 'admin@spottours.com';
  const role = admin?.role === 'superadmin' ? 'Super Admin' : (admin?.role ? admin.role.toUpperCase() : 'Administrator');
  const initial = (name[0] || 'A').toUpperCase();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  async function handleLogout() {
    setLoading(true);
    try {
      await api.logout();
      navigate('/admin/login');
    } catch {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }

  // 1. Sidebar Bottom Profile Card Variant
  if (variant === 'sidebar') {
    return (
      <div className="adm-sidebar-user-card">
        <div className="adm-user-avatar">
          <span>{initial}</span>
        </div>
        <div className="adm-user-meta">
          <div className="adm-user-name" title={name}>{name}</div>
          <div className="adm-user-role">{role}</div>
        </div>
        <button
          type="button"
          className="adm-user-logout-btn"
          onClick={handleLogout}
          title="Sign out of Admin"
          disabled={loading}
          aria-label="Logout"
        >
          <MdLogout />
        </button>
      </div>
    );
  }

  // 2. Header Dropdown Trigger & Popover Variant
  return (
    <div className="adm-header-user-wrapper" ref={menuRef}>
      <button
        type="button"
        className={`adm-header-user-trigger ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="adm-header-avatar">
          <span>{initial}</span>
        </div>
        <div className="adm-header-user-text">
          <span className="adm-header-name">{name}</span>
          <span className="adm-header-badge">Admin</span>
        </div>
        <MdKeyboardArrowDown className={`adm-header-caret ${open ? 'rotated' : ''}`} />
      </button>

      {open && (
        <div className="adm-header-user-dropdown" role="menu">
          <div className="adm-dropdown-header">
            <div className="adm-dropdown-avatar">
              <span>{initial}</span>
            </div>
            <div className="adm-dropdown-user-info">
              <div className="adm-dropdown-name">{name}</div>
              <div className="adm-dropdown-email">{email}</div>
              <div className="adm-dropdown-role-tag">
                <MdShield /> {role}
              </div>
            </div>
          </div>

          <div className="adm-dropdown-divider" />

          <div className="adm-dropdown-menu">
            <Link
              to="/admin/dashboard"
              className="adm-dropdown-item"
              onClick={() => { setOpen(false); onNavigate?.(); }}
            >
              <MdOutlineDashboard className="adm-dropdown-icon" />
              <span>Dashboard Overview</span>
            </Link>
            <Link
              to="/admin/team"
              className="adm-dropdown-item"
              onClick={() => { setOpen(false); onNavigate?.(); }}
            >
              <MdPersonOutline className="adm-dropdown-icon" />
              <span>Team & Admin Access</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="adm-dropdown-item"
              onClick={() => setOpen(false)}
            >
              <MdOutlineLaunch className="adm-dropdown-icon" />
              <span>View Public Website</span>
            </a>
          </div>

          <div className="adm-dropdown-divider" />

          <div className="adm-dropdown-footer">
            <button
              type="button"
              className="adm-dropdown-logout-btn"
              onClick={handleLogout}
              disabled={loading}
            >
              <MdLogout />
              <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
