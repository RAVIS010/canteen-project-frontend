import React, { useEffect } from 'react';
import { Bell, X, Info } from 'lucide-react';

const NotificationPanel = ({
    showNotifications,
    setShowNotifications,
    notifications,
    notificationRef
}) => {
    // Optional: Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications, setShowNotifications, notificationRef]);

    if (!showNotifications) return null;

    return (
        <div className="notification-panel animate-slideDown" style={{
            position: 'absolute',
            top: '70px',
            right: window.innerWidth <= 480 ? '10px' : '24px',
            width: 'calc(100vw - 20px)',
            maxWidth: '350px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            zIndex: 1000,
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '16px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc'
            }}>
                <h4 style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Notifications</h4>
                <button
                    onClick={() => setShowNotifications(false)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                    <X size={18} />
                </button>
            </div>
            <div className="notification-list custom-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                        <Bell size={24} style={{ marginBottom: '12px', opacity: 0.3 }} />
                        <p style={{ fontSize: '0.9rem' }}>No new notifications</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div key={n.id} style={{
                            padding: '16px',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            gap: '12px',
                            transition: 'background 0.2s',
                            cursor: 'pointer'
                        }} className="notification-item">
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: n.status === 'Accepted' ? '#dcfce7' : '#dbeafe',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Info size={18} color={n.status === 'Accepted' ? '#16a34a' : '#2563eb'} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                                    {n.status === 'Accepted' ? 'Load Received' : 'New Load Incoming'}
                                </p>
                                <p style={{ margin: '4px 0', fontSize: '0.75rem', color: '#475569' }}>
                                    {n.qty} {n.item} from {n.from}
                                </p>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{n.time}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
