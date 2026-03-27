import React from 'react';
import { CheckCircle } from 'lucide-react';

const ReceiveItemsTab = ({ acceptedMsg, pendingTransfers, handleAcceptTransfer }) => {
    return (
        <div className="content-card animate-fadeIn">
            <div className="card-header pb-4 border-b border-[#222]">
                <div>
                    <h2>Receive Items</h2>
                </div>
            </div>

            {acceptedMsg && (
                <div style={{
                    background: 'linear-gradient(135deg, #065f46, #047857)',
                    border: '1px solid #10b981',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    margin: '16px 0',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '15px',
                    boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    {acceptedMsg}
                </div>
            )}

            <div className="table-container mt-8">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Ref ID</th>
                            <th>Type</th>
                            <th>Item Name</th>
                            <th>Expected Qty</th>
                            <th>Source</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingTransfers.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                                    No incoming loads or returns found.
                                </td>
                            </tr>
                        ) : (
                            pendingTransfers.map(t => (
                                <tr key={t._id}>
                                    <td style={{ fontFamily: 'monospace', color: '#60a5fa' }}>{t._id ? t._id.slice(-6).toUpperCase() : 'N/A'}</td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            background: t.status === 'Returned' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                            color: t.status === 'Returned' ? '#ef4444' : '#8b5cf6',
                                            border: `1px solid ${t.status === 'Returned' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 92, 246, 0.2)'}`
                                        }}>
                                            {t.status === 'Returned' ? 'RETURN' : 'TRANSFER'}
                                        </span>
                                    </td>
                                    <td className="font-bold">{t.item}</td>
                                    <td>{t.quantity}</td>
                                    <td>{t.from}</td>
                                    <td>
                                        <span className={`status-badge ${t.status === 'Accepted' ? 'completed' : 'waiting'}`}>
                                            {t.status === 'Accepted' ? 'ACCEPTED' : 'PENDING'}
                                        </span>
                                    </td>
                                    <td>
                                        {(t.status === 'Pending' || t.status === 'Returned') && (
                                            <button
                                                className="primary-btn-sm success"
                                                onClick={() => handleAcceptTransfer(t)}
                                            >
                                                {t.status === 'Returned' ? 'ACCEPT RETURN' : 'ACCEPT LOAD'}
                                            </button>
                                        )}
                                        {t.status === 'Accepted' && (
                                            <div className="flex items-center justify-center text-green-500 font-bold gap-2 py-2">
                                                <CheckCircle size={18} />
                                                <span style={{ fontSize: '12px', letterSpacing: '1px' }}>COMPLETED</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReceiveItemsTab;
