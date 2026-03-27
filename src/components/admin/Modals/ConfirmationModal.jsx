import React from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ show, title, message, onConfirm, onCancel, confirmText = 'CONFIRM', cancelText = 'CANCEL', type = 'danger' }) => {
    if (!show) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <Trash2 size={30} color="#ff4d4d" />;
            case 'warning':
                return <AlertTriangle size={30} color="#f59e0b" />;
            default:
                return <AlertTriangle size={30} color="#2563eb" />;
        }
    };

    const getIconBackground = () => {
        switch (type) {
            case 'danger':
                return 'rgba(255, 77, 77, 0.1)';
            case 'warning':
                return 'rgba(245, 158, 11, 0.1)';
            default:
                return 'rgba(37, 99, 235, 0.1)';
        }
    };

    const getConfirmButtonStyles = () => {
        switch (type) {
            case 'danger':
                return { background: 'linear-gradient(135deg, #ff4d4d 0%, #dc2626 100%)', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' };
            case 'warning':
                return { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)' };
            default:
                return { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' };
        }
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
            <div className="modal-content animate-slideUp" style={{ maxWidth: '450px', padding: '35px', textAlign: 'center', borderRadius: '24px' }}>
                <div style={{
                    background: getIconBackground(),
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 25px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    {getIcon()}
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '15px', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.5px' }}>
                    {title}
                </h3>

                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6', marginBottom: '30px', padding: '0 10px' }}>
                    {message}
                </p>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        className="close-btn"
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            height: '56px',
                            borderRadius: '14px',
                            background: '#f1f5f9',
                            color: '#475569',
                            fontWeight: 800,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="primary-btn"
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            height: '56px',
                            ...getConfirmButtonStyles(),
                            color: 'white',
                            fontWeight: 800,
                            border: 'none',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
