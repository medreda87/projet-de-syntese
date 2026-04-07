import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import './AlertModal.css';

const iconMap = {
  success: { Icon: CheckCircle, className: 'alert-modal--success' },
  error: { Icon: XCircle, className: 'alert-modal--error' },
  warning: { Icon: AlertTriangle, className: 'alert-modal--warning' },
  info: { Icon: Info, className: 'alert-modal--info' },
};

const AlertModal = ({
  isOpen,
  onClose,
  type = 'success',
  title,
  message,
  confirmText = 'OK',
  cancelText,
  onConfirm,
  autoClose = 0,
}) => {
  useEffect(() => {
    if (isOpen && autoClose > 0) {
      const timer = setTimeout(() => onClose(), autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  useEffect(() => {
    if (isOpen) {
      const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { Icon, className } = iconMap[type] || iconMap.info;

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className={`alert-modal ${className}`} onClick={(e) => e.stopPropagation()}>
        <button className="alert-modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="alert-modal-icon">
          <Icon size={32} />
        </div>

        {title && <h3 className="alert-modal-title">{title}</h3>}
        {message && <p className="alert-modal-message">{message}</p>}

        <div className="alert-modal-actions">
          {cancelText && (
            <button className="alert-modal-btn alert-modal-btn--cancel" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button
            className="alert-modal-btn alert-modal-btn--confirm"
            onClick={() => { if (onConfirm) onConfirm(); else onClose(); }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
