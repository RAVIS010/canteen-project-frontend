import '../Admin.css';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Trash2 } from 'lucide-react';
import api from '../../../api/axios';

// ─── Edit CPS Modal ────────────────────────────────────────────────────────────
export const EditCPSModal = ({ showEditCPSModal, setShowEditCPSModal, productionUnits, setProductionUnits }) => {
    const [selectedUnitName, setSelectedUnitName] = useState('');
    const [newName, setNewName] = useState('');

    // Sync selected unit whenever the modal opens or the units list loads
    useEffect(() => {
        if (showEditCPSModal && productionUnits.length > 0) {
            const first = productionUnits[0].name;
            setSelectedUnitName(first);
            setNewName(first); // pre-fill the current name
        }
    }, [showEditCPSModal, productionUnits]);

    // When user picks a different unit, pre-fill its name
    const handleSelectChange = (e) => {
        const name = e.target.value;
        setSelectedUnitName(name);
        setNewName(name);
    };

    const handleConfirm = async () => {
        const trimmed = newName.trim();
        if (!trimmed || !selectedUnitName) {
            toast.error('Please enter a new name');
            return;
        }
        try {
            const unit = productionUnits.find(u => u.name === selectedUnitName);
            if (!unit || !unit._id) {
                toast.error('Could not find unit ID');
                return;
            }
            await api.put(`/canteens/${unit._id}`, { name: trimmed.toUpperCase() });
            toast.success('Production unit updated');
            setProductionUnits(); // triggers fetchInitialData in parent
            setShowEditCPSModal(false);
        } catch (e) {
            toast.error(e.response?.data?.error || 'Failed to update unit');
        }
    };

    if (!showEditCPSModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-slideUp">
                <div className="modal-header">
                    <h3>Edit CPS Unit</h3>
                    <button className="close-btn" onClick={() => setShowEditCPSModal(false)}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    {productionUnits.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px 0' }}>No production units available.</p>
                    ) : (
                        <>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label className="common-input-label">SELECT UNIT</label>
                                <select
                                    className="dark-field"
                                    value={selectedUnitName}
                                    onChange={handleSelectChange}
                                >
                                    {productionUnits.map((unit, idx) => (
                                        <option key={idx} value={unit.name}>{unit.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '30px' }}>
                                <label className="common-input-label">NEW NAME</label>
                                <input
                                    type="text"
                                    className="dark-field"
                                    placeholder="Enter new name"
                                    onChange={(e) => setNewName(e.target.value)}
                                    value={newName}
                                />
                            </div>
                            <button className="primary-btn" style={{ width: '100%', padding: '18px' }} onClick={handleConfirm}>
                                CONFIRM CHANGES
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Delete CPS Modal ───────────────────────────────────────────────────────────
export const DeleteCPSModal = ({ showDeleteCPSModal, setShowDeleteCPSModal, productionUnits, setProductionUnits }) => {
    const [unitToDelete, setUnitToDelete] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Sync selected unit whenever the modal opens or the units list loads
    useEffect(() => {
        if (showDeleteCPSModal && productionUnits.length > 0) {
            setUnitToDelete(productionUnits[0].name);
            setIsConfirmed(false);
        }
    }, [showDeleteCPSModal, productionUnits]);

    const handleDelete = async () => {
        if (!isConfirmed || !unitToDelete) return;
        try {
            // Backend DELETE /canteens/:name  (name-based route)
            await api.delete(`/canteens/${encodeURIComponent(unitToDelete)}`);
            toast.success(`"${unitToDelete}" deleted successfully`);
            setProductionUnits();
            setShowDeleteCPSModal(false);
            setIsConfirmed(false);
        } catch (e) {
            toast.error(e.response?.data?.error || 'Failed to delete unit');
        }
    };

    if (!showDeleteCPSModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-slideUp">
                <div className="modal-header">
                    <h3>Delete CPS Unit</h3>
                    <button className="close-btn" onClick={() => setShowDeleteCPSModal(false)}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '16px', marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                        <div style={{ background: '#ef4444', padding: '12px', borderRadius: '12px', color: 'white' }}>
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', letterSpacing: '0.5px' }}>PERMANENT ACTION</p>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>This production unit will be removed from circulation.</p>
                        </div>
                    </div>

                    {productionUnits.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px 0' }}>No production units available.</p>
                    ) : (
                        <>
                            <div className="form-group" style={{ marginBottom: '25px' }}>
                                <label className="common-input-label">SELECT UNIT TO DELETE</label>
                                <select
                                    className="dark-field"
                                    value={unitToDelete}
                                    onChange={(e) => setUnitToDelete(e.target.value)}
                                >
                                    {productionUnits.map((unit, idx) => (
                                        <option key={idx} value={unit.name}>{unit.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <input
                                    type="checkbox"
                                    id="confirmDelete"
                                    checked={isConfirmed}
                                    onChange={(e) => setIsConfirmed(e.target.checked)}
                                    style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', accentColor: '#ef4444' }}
                                />
                                <label htmlFor="confirmDelete" style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer', lineHeight: '1.4' }}>
                                    I understand that this action is permanent and I want to proceed with deleting this production unit.
                                </label>
                            </div>

                            <button
                                className="primary-btn"
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    background: isConfirmed ? '#ef4444' : '#cbd5e1',
                                    cursor: isConfirmed ? 'pointer' : 'not-allowed',
                                    color: 'white'
                                }}
                                onClick={handleDelete}
                                disabled={!isConfirmed}
                            >
                                DELETE PRODUCTION UNIT
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Suspend Modal ──────────────────────────────────────────────────────────────
export const SuspendModal = ({ showSuspendModal, setShowSuspendModal, productionUnits, setProductionUnits }) => {
    const [unitToSuspend, setUnitToSuspend] = useState('');

    const activeUnits = productionUnits.filter(u => u.status !== 'SUSPENDED');

    // Sync selected unit whenever the modal opens or units list updates
    useEffect(() => {
        if (showSuspendModal && activeUnits.length > 0) {
            setUnitToSuspend(activeUnits[0].name);
        }
    }, [showSuspendModal, productionUnits]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSuspend = async () => {
        if (!unitToSuspend) return;
        try {
            const unit = productionUnits.find(u => u.name === unitToSuspend);
            if (!unit || !unit._id) {
                toast.error('Could not find unit ID');
                return;
            }
            await api.put(`/canteens/${unit._id}`, { status: 'SUSPENDED' });
            toast.success(`"${unitToSuspend}" has been suspended`);
            setProductionUnits();
            setShowSuspendModal(false);
        } catch (e) {
            toast.error(e.response?.data?.error || 'Failed to suspend unit');
        }
    };

    if (!showSuspendModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-slideUp">
                <div className="modal-header">
                    <h3>Suspend CPS Unit</h3>
                    <button className="close-btn" onClick={() => setShowSuspendModal(false)}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    {activeUnits.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px 0' }}>No active units to suspend.</p>
                    ) : (
                        <>
                            <div className="form-group" style={{ marginBottom: '25px' }}>
                                <label className="common-input-label">SELECT UNIT TO SUSPEND</label>
                                <select
                                    className="dark-field"
                                    value={unitToSuspend}
                                    onChange={(e) => setUnitToSuspend(e.target.value)}
                                >
                                    {activeUnits.map((unit, idx) => (
                                        <option key={idx} value={unit.name}>{unit.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                className="primary-btn"
                                style={{ width: '100%', padding: '18px', background: '#f59e0b', color: 'white' }}
                                onClick={handleSuspend}
                            >
                                SUSPEND OPERATIONS
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Unsuspend Modal ────────────────────────────────────────────────────────────
export const UnsuspendModal = ({ showUnsuspendModal, setShowUnsuspendModal, productionUnits, setProductionUnits }) => {
    const [unitToUnsuspend, setUnitToUnsuspend] = useState('');

    const suspendedUnits = productionUnits.filter(u => u.status === 'SUSPENDED');

    // Sync selected unit whenever the modal opens or units list updates
    useEffect(() => {
        if (showUnsuspendModal && suspendedUnits.length > 0) {
            setUnitToUnsuspend(suspendedUnits[0].name);
        }
    }, [showUnsuspendModal, productionUnits]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleUnsuspend = async () => {
        if (!unitToUnsuspend) return;
        try {
            const unit = productionUnits.find(u => u.name === unitToUnsuspend);
            if (!unit || !unit._id) {
                toast.error('Could not find unit ID');
                return;
            }
            await api.put(`/canteens/${unit._id}`, { status: 'ACTIVE' });
            toast.success(`"${unitToUnsuspend}" is now active`);
            setProductionUnits();
            setShowUnsuspendModal(false);
        } catch (e) {
            toast.error(e.response?.data?.error || 'Failed to reactivate unit');
        }
    };

    if (!showUnsuspendModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-slideUp">
                <div className="modal-header">
                    <h3>Unsuspend CPS Unit</h3>
                    <button className="close-btn" onClick={() => setShowUnsuspendModal(false)}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    {suspendedUnits.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px 0' }}>No suspended units to reactivate.</p>
                    ) : (
                        <>
                            <div className="form-group" style={{ marginBottom: '25px' }}>
                                <label className="common-input-label">SELECT UNIT TO UNSUSPEND</label>
                                <select
                                    className="dark-field"
                                    value={unitToUnsuspend}
                                    onChange={(e) => setUnitToUnsuspend(e.target.value)}
                                >
                                    {suspendedUnits.map((unit, idx) => (
                                        <option key={idx} value={unit.name}>{unit.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                className="primary-btn"
                                style={{ width: '100%', padding: '18px', background: '#10b981', color: 'white' }}
                                onClick={handleUnsuspend}
                            >
                                REACTIVATE UNIT
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Create CPS Modal ───────────────────────────────────────────────────────────
export const CreateCPSModal = ({ showCreateCPSModal, setShowCreateCPSModal, setProductionUnits }) => {
    const [unitName, setUnitName] = useState('');

    const handleCreate = async () => {
        if (!unitName.trim()) {
            toast.error('Please enter a name for the production unit');
            return;
        }
        try {
            await api.post('/canteens', { name: unitName.toUpperCase(), type: 'PRODUCTION' });
            toast.success('Production unit created');
            setProductionUnits();
            setShowCreateCPSModal(false);
            setUnitName('');
        } catch (e) {
            toast.error(e.response?.data?.error || 'Failed to create unit');
        }
    };

    if (!showCreateCPSModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-slideUp">
                <div className="modal-header">
                    <h3>Create New CPS Unit</h3>
                    <button className="close-btn" onClick={() => setShowCreateCPSModal(false)}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label className="common-input-label">PRODUCTION UNIT NAME</label>
                        <input
                            type="text"
                            className="dark-field"
                            placeholder="e.g. BAKERY SECTION"
                            onChange={(e) => setUnitName(e.target.value)}
                            value={unitName}
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        />
                    </div>
                    <button
                        className="primary-btn"
                        style={{ width: '100%', padding: '18px', background: '#2563eb', color: 'white' }}
                        onClick={handleCreate}
                    >
                        INITIALIZE UNIT
                    </button>
                </div>
            </div>
        </div>
    );
};

