import React from 'react';
import { MdWarning, MdClose, MdDelete } from 'react-icons/md';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="adm-modal-overlay" onClick={onCancel}>
      <div className="adm-modal adm-modal-sm" onClick={e => e.stopPropagation()} style={{ maxWidth: 440, borderRadius: 20 }}>
        <div style={{ padding: '24px 28px', textAlign: 'center' }}>
          <div style={{ 
            width: 56, 
            height: 56, 
            borderRadius: '50%', 
            background: '#FEE2E2', 
            color: '#DC2626', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.8rem',
            marginBottom: 16
          }}>
            <MdWarning />
          </div>

          <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontFamily: 'Oswald, sans-serif', color: 'var(--adm-text-main)' }}>
            {title || 'Are you sure?'}
          </h3>

          <p style={{ margin: '0 0 24px', fontSize: '0.9rem', color: 'var(--adm-text-muted)', lineHeight: 1.5 }}>
            {message || 'This action cannot be undone. Do you really want to proceed?'}
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button 
              type="button" 
              className="adm-btn adm-btn-ghost" 
              onClick={onCancel}
              style={{ flex: 1, padding: '10px 16px', borderRadius: 10 }}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="adm-btn adm-btn-danger" 
              onClick={onConfirm}
              style={{ flex: 1, padding: '10px 16px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              disabled={loading}
            >
              <MdDelete /> {loading ? 'Deleting...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
