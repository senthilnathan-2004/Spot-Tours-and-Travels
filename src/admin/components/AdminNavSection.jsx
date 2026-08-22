import React from 'react';

export default function AdminNavSection({ title, children }) {
  return (
    <div className="adm-nav-section">
      {title && <div className="adm-nav-section-title">{title}</div>}
      <div className="adm-nav-section-items">
        {children}
      </div>
    </div>
  );
}
