import React, { useEffect } from 'react';
import { MdClose } from 'react-icons/md';

export default function AdminMobileSidebar({ open, onClose, children }) {
  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="adm-mobile-drawer-root" role="dialog" aria-modal="true">
      <div
        className="adm-mobile-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="adm-mobile-drawer-content">
        <button
          type="button"
          className="adm-mobile-drawer-close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <MdClose />
        </button>
        {children}
      </div>
    </div>
  );
}
