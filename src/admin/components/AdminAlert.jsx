import React, { useEffect } from 'react';
import { MdCheckCircle, MdError, MdInfo, MdWarning, MdClose } from 'react-icons/md';

export default function AdminAlert({ alert, onClose }) {
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [alert, onClose]);

  if (!alert) return null;

  const isError = alert.type === 'error' || alert.type === 'danger';
  const isWarning = alert.type === 'warning';
  const isInfo = alert.type === 'info';
  const isSuccess = !isError && !isWarning && !isInfo;

  let Icon = MdCheckCircle;
  let bgGradient = 'linear-gradient(135deg, #065F46 0%, #047857 100%)';
  let borderColor = '#34D399';
  let title = 'Success';

  if (isError) {
    Icon = MdError;
    bgGradient = 'linear-gradient(135deg, #991B1B 0%, #DC2626 100%)';
    borderColor = '#F87171';
    title = 'Error';
  } else if (isWarning) {
    Icon = MdWarning;
    bgGradient = 'linear-gradient(135deg, #92400E 0%, #D97706 100%)';
    borderColor = '#FBBF24';
    title = 'Notice';
  } else if (isInfo) {
    Icon = MdInfo;
    bgGradient = 'linear-gradient(135deg, #075985 0%, #0284C7 100%)';
    borderColor = '#38BDF8';
    title = 'Information';
  }

  const message = typeof alert === 'string' ? alert : alert.msg || alert.message || '';

  return (
    <div className="adm-toast-container">
      <div className="adm-toast-card" style={{ borderLeft: `5px solid ${borderColor}` }}>
        <div className="adm-toast-icon-wrap" style={{ background: bgGradient }}>
          <Icon style={{ fontSize: '1.25rem', color: '#FFFFFF' }} />
        </div>
        <div className="adm-toast-content">
          <div className="adm-toast-title">{title}</div>
          <div className="adm-toast-msg">{message}</div>
        </div>
        {onClose && (
          <button 
            type="button" 
            className="adm-toast-close-btn" 
            onClick={onClose}
            aria-label="Close notification"
          >
            <MdClose />
          </button>
        )}
      </div>
    </div>
  );
}
