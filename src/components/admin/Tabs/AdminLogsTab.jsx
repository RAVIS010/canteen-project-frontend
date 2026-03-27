import '../Admin.css';
import React from 'react';
import { Search, History, Users, Trash2 } from 'lucide-react';

const AdminLogsTab = ({
    sessionLogs = [],
    logSearchTerm = '',
    setLogSearchTerm,
    showUserLoginStats = false,
    setShowUserLoginStats,
    handleClearAllSessionLogs,
    handleDeleteSessionLog
}) => {
    const logsToRender = sessionLogs
        .filter(log => {
            if (!logSearchTerm) return true;
            return (log.name || log.fullName || '').toLowerCase().includes(logSearchTerm.toLowerCase());
        })
        .filter(log => !['Anbarasan (Anbu)', 'Meenakshi Devi'].includes(log.name || log.fullName))
        .map((log) => {
            const lTime = new Date(log.loginTime);
            const loTime = log.logoutTime ? new Date(log.logoutTime) : null;
            return {
                id: log._id,
                user: log.name || log.fullName,
                date: lTime.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }),
                loginTime: lTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                logoutTime: loTime ? loTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active',
                shift: log.shift,
                salesUnit: log.salesUnit || '--',
                billsCount: log.billsCount || 0
            };
        });

    const userStats = logsToRender.reduce((acc, log) => {
        acc[log.user] = (acc[log.user] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="table-container animate-fadeIn">
            <div className="table-header" style={{
                padding: '24px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#ffffff'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px', color: '#0f172a' }}>
                        {showUserLoginStats ? 'User Login Dashboard' : 'User Timing History'}
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
                        {showUserLoginStats ? 'Summary of total login instances per user' : 'Detailed monitoring of shift timings and duration'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={logSearchTerm}
                            onChange={(e) => setLogSearchTerm(e.target.value)}
                            style={{
                                padding: '10px 15px 10px 35px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.85rem',
                                outline: 'none',
                                width: '200px'
                            }}
                        />
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                    <button
                        className="primary-btn-sm"
                        style={{
                            background: '#000000',
                            color: '#ffffff',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onClick={() => setShowUserLoginStats(!showUserLoginStats)}
                    >
                        {showUserLoginStats ? <History size={16} /> : <Users size={16} />}
                        {showUserLoginStats ? 'View Full History' : 'View Summaries'}
                    </button>
                    {!showUserLoginStats && (
                        <button
                            className="primary-btn-sm"
                            style={{
                                background: '#ef4444',
                                color: '#ffffff',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onClick={handleClearAllSessionLogs}
                        >
                            <Trash2 size={16} />
                            Clear All Logs
                        </button>
                    )}
                </div>
            </div>

            {
                showUserLoginStats ? (
                    <div style={{ padding: '24px' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '20px'
                        }}>
                            {Object.entries(userStats).map(([userName, count], idx) => (
                                <div key={idx} style={{
                                    background: '#f8fafc',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>User Name</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{userName}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Total Logins</div>
                                        <div style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 900,
                                            color: '#7c3aed',
                                            background: '#f5f3ff',
                                            padding: '4px 12px',
                                            borderRadius: '8px',
                                            display: 'inline-block'
                                        }}>{count}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>User</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Login Time</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Logout Time</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Shift</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Sales Unit</th>
                                <th style={{ padding: '16px 24px', textAlign: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Bills Generated</th>
                                <th style={{ padding: '16px 24px', textAlign: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logsToRender.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: 900, color: '#0f172a' }}>{log.user}</td>
                                    <td style={{ padding: '16px 24px', color: '#475569' }}>{log.date}</td>
                                    <td style={{ padding: '16px 24px', color: '#16a34a', fontWeight: 800 }}>{log.loginTime}</td>
                                    <td style={{ padding: '16px 24px', color: '#ef4444', fontWeight: 800 }}>{log.logoutTime}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span className={`category-tag`} style={{
                                            background: log.shift === 'Morning' ? '#7c3aed' : log.shift === 'Afternoon' ? '#4c1d95' : '#581c87',
                                            color: '#ffffff',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}>
                                            {log.shift}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#475569', fontWeight: 700 }}>
                                        {log.salesUnit}
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'center', fontWeight: 900, color: log.billsCount > 0 ? '#10b981' : '#94a3b8' }}>
                                        {log.billsCount}
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                        <button
                                            className="text-btn delete-btn"
                                            style={{ color: '#ff4d4d', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', background: 'transparent', border: 'none' }}
                                            onClick={() => handleDeleteSessionLog(log.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
        </div>
    );
};

export default AdminLogsTab;
