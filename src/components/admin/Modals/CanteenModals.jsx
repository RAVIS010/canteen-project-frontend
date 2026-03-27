import '../Admin.css';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Trash2 } from 'lucide-react';

export const AddCanteenModal = ({ showAddCanteenModal, setShowAddCanteenModal, confirmAddCanteen }) => {
    const [canteenData, setCanteenData] = useState({ name: '', location: '' });
    const [errors, setErrors] = useState({ name: '', location: '' });

    const handleClose = () => {
        setCanteenData({ name: '', location: '' });
        setErrors({ name: '', location: '' });
        setShowAddCanteenModal(false);
    };

    const handleChange = (field, value) => {
        setCanteenData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: value.trim() ? '' : prev[field] }));
    };

    const handleSubmit = () => {
        const nextErrors = {
            name: canteenData.name.trim() ? '' : 'Canteen name is required.',
            location: canteenData.location.trim() ? '' : 'Location is required.'
        };

        setErrors(nextErrors);

        if (nextErrors.name || nextErrors.location) {
            toast.error('Please fill all required fields.');
            return;
        }

        confirmAddCanteen({
            name: canteenData.name.trim(),
            location: canteenData.location.trim()
        });
        setCanteenData({ name: '', location: '' });
        setErrors({ name: '', location: '' });
    };

    if (!showAddCanteenModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-slideUp">
                <div className="modal-header">
                    <h3>Add New Canteen</h3>
                    <button className="close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="common-input-label">CANTEEN NAME</label>
                        <input
                            type="text"
                            placeholder="Enter canteen name (e.g., Canteen 5)"
                            className={`dark-field ${errors.name ? 'field-error' : ''}`}
                            value={canteenData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            autoFocus
                        />
                        {errors.name && <p className="field-error-message">{errors.name}</p>}
                    </div>
                    <div className="form-group" style={{ marginBottom: '25px' }}>
                        <label className="common-input-label">LOCATION</label>
                        <input
                            type="text"
                            placeholder="Enter location"
                            className={`dark-field ${errors.location ? 'field-error' : ''}`}
                            value={canteenData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                        />
                        {errors.location && <p className="field-error-message">{errors.location}</p>}
                    </div>
                    <button
                        className="primary-btn"
                        style={{ width: '100%', padding: '18px', fontSize: '0.95rem' }}
                        onClick={handleSubmit}
                    >
                        CONFIRM ADDITION
                    </button>
                </div>
            </div>
        </div>
    );
};


export const DeletionConfirmModal = ({ show, onConfirm, onCancel, canteenName }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
            <div className="modal-content animate-slideUp" style={{ maxWidth: '450px', padding: '30px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(255, 77, 77, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(255, 77, 77, 0.2)' }}>
                    <Trash2 size={30} color="#ff4d4d" />
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '15px', textTransform: 'uppercase', color: '#0f172a' }}>Confirm Deletion</h3>

                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px' }}>
                    Are you sure you want to remove <span style={{ color: '#0f172a', fontWeight: 800 }}>{canteenName?.toUpperCase()}</span> from your dashboard?
                </p>

                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '30px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Security Note:</p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
                        All existing sales records, bills, and stock history for this unit will be <span style={{ color: '#10b981', fontWeight: 700 }}>PERMANENTLY PRESERVED</span> in your system for reporting purposes.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        className="close-btn"
                        onClick={onCancel}
                        style={{ flex: 1, height: '54px', borderRadius: '12px', background: '#f1f5f9', fontWeight: 700 }}
                    >
                        CANCEL
                    </button>
                    <button
                        className="primary-btn"
                        onClick={onConfirm}
                        style={{ flex: 1, background: '#ef4444', color: 'white', fontWeight: 700 }}
                    >
                        CONFIRM
                    </button>
                </div>
            </div>
        </div>
    );
};

export const DeleteCanteenModal = ({ showDeleteModal, setShowDeleteModal, canteens, confirmDeleteCanteen }) => {
    if (!showDeleteModal) return null;

    return (
        <div className="modal-overlay animate-fadeIn" style={{ zIndex: 2000 }}>
            <div className="modal-content animate-slideUp" style={{ maxWidth: '480px' }}>
                <div className="modal-header">
                    <h3>Select Canteen to Delete</h3>
                    <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '16px', marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                        <div style={{ background: '#ef4444', padding: '12px', borderRadius: '12px', color: 'white' }}>
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', letterSpacing: '0.5px' }}>SAFE DELETION ACTIVE</p>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>Sales data and history will be preserved automatically.</p>
                        </div>
                    </div>

                    <div className="canteen-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
                        {canteens.map((c) => (
                            <div
                                key={c}
                                className="stat-card clickable"
                                style={{
                                    padding: '18px 24px',
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => confirmDeleteCanteen(c)}
                            >
                                <span style={{ fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', fontSize: '0.95rem' }}>{c}</span>
                                <Trash2 size={18} color="#ef4444" />
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '25px', textAlign: 'center' }}>
                        <button className="text-btn" onClick={() => setShowDeleteModal(false)} style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>CLOSE</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

