import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminNavItem({
  to,
  icon: Icon,
  label,
  badge,
  badgeType = 'danger',
  external = false,
  onClick
}) {
  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className="adm-nav-item"
        onClick={onClick}
      >
        <span className="adm-nav-indicator" />
        <span className="adm-nav-icon-wrap">
          {Icon && <Icon className="adm-nav-icon" />}
        </span>
        <span className="adm-nav-label">{label}</span>
        <span className="adm-nav-external-icon">↗</span>
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      end={to === '/admin' || to === '/admin/dashboard'}
      className={({ isActive }) =>
        `adm-nav-item ${isActive ? 'active' : ''}`
      }
      onClick={onClick}
    >
      <span className="adm-nav-indicator" />
      <span className="adm-nav-icon-wrap">
        {Icon && <Icon className="adm-nav-icon" />}
      </span>
      <span className="adm-nav-label">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`adm-nav-badge adm-nav-badge-${badgeType}`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  );
}
