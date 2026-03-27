import React, { useState } from 'react';
import { X, Store, FileText, Trash2, AlertTriangle } from 'lucide-react';

const BillsBreakdownModal = ({ show, onClose, breakdown, onDelete }) => {
    const [confirmingCanteen, setConfirmingCanteen] = useState(null); // canteen name pending delete

    if (!show) return null;

    const handleDeleteClick = (canteen) => {
        setConfirmingCanteen(canteen);
    };

    const handleConfirmDelete = () => {
        if (onDelete && confirmingCanteen) {
            onDelete(confirmingCanteen);
        }
        setConfirmingCanteen(null);
    };

    const handleCancelDelete = () => {
        setConfirmingCanteen(null);
    };

    return (
        <div className="modal-overlay" style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(15, 23, 42, 0.75)', 
            backdropFilter: 'blur(8px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999, 
            padding: '20px' 
        }}>
            <div className="modal-content animate-scaleUp" style={{ 
                background: '#fff', 
                borderRadius: '24px', 
                width: '100%', 
                maxWidth: '520px', 
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', 
                overflow: 'hidden' 
            }}>
                {/* Header */}
                <div style={{ 
                    padding: '24px', 
                    background: '#f1f5f9', 
                    borderBottom: '1px solid #e2e8f0', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#2563eb', padding: '10px', borderRadius: '12px', color: '#fff' }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Bills Breakdown</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>Daily statistics per canteen</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            background: '#fff', 
                            border: '1px solid #e2e8f0', 
                            color: '#94a3b8', 
                            cursor: 'pointer', 
                            padding: '8px', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '32px' }}>
                    <div className="custom-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                        {breakdown && breakdown.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '0 12px 8px', color: '#64748b', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Canteen Name</th>
                                        <th style={{ textAlign: 'right', padding: '0 12px 8px', color: '#64748b', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Bills</th>
                                        <th style={{ textAlign: 'center', padding: '0 12px 8px', color: '#64748b', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {breakdown.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <tr style={{ background: '#f8fafc', transition: 'transform 0.2s' }}>
                                                {/* Canteen Name */}
                                                <td style={{ padding: '16px 12px', borderRadius: confirmingCanteen === item.canteen ? '12px 0 0 0' : '12px 0 0 12px', border: '1px solid #e2e8f0', borderRight: 'none', borderBottom: confirmingCanteen === item.canteen ? 'none' : undefined }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '8px', color: '#3b82f6' }}>
                                                            <Store size={16} />
                                                        </div>
                                                        <span style={{ fontWeight: 700, color: '#0f172a', textTransform: 'capitalize' }}>
                                                            {item.canteen}
                                                        </span>
                                                    </div>
                                                </td>
                                                {/* Count */}
                                                <td style={{ padding: '16px 12px', border: '1px solid #e2e8f0', borderLeft: 'none', borderRight: 'none', textAlign: 'right', borderBottom: confirmingCanteen === item.canteen ? 'none' : undefined }}>
                                                    <span style={{ 
                                                        background: '#2563eb', 
                                                        color: '#fff', 
                                                        padding: '4px 12px', 
                                                        borderRadius: '20px', 
                                                        fontSize: '0.9rem', 
                                                        fontWeight: 800 
                                                    }}>
                                                        {item.count}
                                                    </span>
                                                </td>
                                                {/* Delete Button */}
                                                <td style={{ padding: '16px 12px', borderRadius: confirmingCanteen === item.canteen ? '0 12px 0 0' : '0 12px 12px 0', border: '1px solid #e2e8f0', borderLeft: 'none', textAlign: 'center', borderBottom: confirmingCanteen === item.canteen ? 'none' : undefined }}>
                                                    {confirmingCanteen === item.canteen ? (
                                                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Confirm?</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDeleteClick(item.canteen)}
                                                            style={{
                                                                background: 'rgba(239, 68, 68, 0.08)',
                                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                                color: '#ef4444',
                                                                cursor: 'pointer',
                                                                padding: '7px',
                                                                borderRadius: '8px',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            title={`Delete all bills for ${item.canteen} today`}
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* Inline confirmation row */}
                                            {confirmingCanteen === item.canteen && (
                                                <tr style={{ background: 'rgba(239, 68, 68, 0.04)' }}>
                                                    <td colSpan={3} style={{ padding: '12px 16px', border: '1px solid rgba(239, 68, 68, 0.2)', borderTop: 'none', borderRadius: '0 0 12px 12px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <AlertTriangle size={15} color="#ef4444" />
                                                                <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}>
                                                                    Delete all {item.count} bill{item.count !== 1 ? 's' : ''} for "{item.canteen}" today?
                                                                </span>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                                                <button
                                                                    onClick={handleCancelDelete}
                                                                    style={{ padding: '5px 12px', borderRadius: '7px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={handleConfirmDelete}
                                                                    style={{ padding: '5px 14px', borderRadius: '7px', border: 'none', background: '#ef4444', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                                <FileText size={48} strokeWidth={1} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                <p style={{ fontWeight: 600 }}>No bills generated today yet.</p>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={onClose} 
                        style={{ 
                            width: '100%', 
                            marginTop: '24px', 
                            padding: '16px', 
                            background: '#0f172a', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '12px', 
                            fontWeight: 800, 
                            fontSize: '0.95rem', 
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.2s'
                        }}
                    >
                        Close Breakdown
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillsBreakdownModal;

