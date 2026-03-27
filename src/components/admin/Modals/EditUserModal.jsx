import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

const EditUserModal = ({ user, onClose, onUpdate, canteens, productionUnits }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        assignedCanteens: []
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || user.fullName || '',
                email: user.email || '',
                role: user.role || '',
                assignedCanteens: user.assignedCanteens || []
            });
        }
    }, [user]);

    const handleUpdateUser = async () => {
        if (!formData.name || !formData.email || !formData.role) {
            return toast.error('All fields are required');
        }

        setIsLoading(true);
        try {
            await api.put(`/users/${user._id}`, formData);
            toast.success('User updated successfully');
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.error || 'Failed to update user');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-slideUp">
                <div className="modal-header">
                    <h3>Edit User Profile</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '20px' }}>
                        Updating details for <strong style={{ color: '#2563eb' }}>{user.name || user.fullName}</strong>
                    </p>

                    <div className="form-group">
                        <label className="common-input-label">NAME</label>
                        <input
                            type="text"
                            className="dark-field"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="common-input-label">EMAIL ADDRESS</label>
                        <input
                            type="email"
                            className="dark-field"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="common-input-label">ROLE</label>
                        <select
                            className="dark-field"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            style={{ background: '#fff' }}
                        >
                            <option value="">Select Role</option>
                            <option value="admin">System Admin</option>
                            <option value="sub-admin">Sub Admin</option>
                            <option value="canteen-manager">Canteen Manager</option>
                            <option value="user">Canteen Staff</option>
                            <option value="mess">Mess Staff</option>
                            {productionUnits?.map((unit, idx) => (
                                <React.Fragment key={idx}>
                                    <option value={`cps-staff-${unit.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                        CPS Staff ({unit.name})
                                    </option>
                                    <option value={`cps-manager-${unit.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                        CPS Manager - {unit.name}
                                    </option>
                                </React.Fragment>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="common-input-label">ASSIGNED CANTEENS / UNITS</label>
                        <div style={{
                            background: '#f8fafc',
                            padding: '15px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            maxHeight: '250px',
                            overflowY: 'auto'
                        }}>
                            {/* Production Units Section */}
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ color: '#2563eb', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>PRODUCTION UNITS</p>
                                <div className="assigned-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                                    {productionUnits?.map((unit) => (
                                        <label key={unit.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#0f172a', fontSize: '0.8rem', fontWeight: 600 }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.assignedCanteens?.includes(unit.name)}
                                                onChange={(e) => {
                                                    const current = formData.assignedCanteens || [];
                                                    const updated = e.target.checked
                                                        ? [...current, unit.name]
                                                        : current.filter(c => c !== unit.name);
                                                    setFormData({ ...formData, assignedCanteens: updated });
                                                }}
                                                style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                                            />
                                            {unit.name.toUpperCase()}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Canteens Section */}
                            <div>
                                <p style={{ color: '#2563eb', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>CANTEENS</p>
                                <div className="assigned-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                                    {canteens?.map((locationName) => (
                                        <label key={locationName} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#0f172a', fontSize: '0.8rem', fontWeight: 600 }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.assignedCanteens?.includes(locationName)}
                                                onChange={(e) => {
                                                    const current = formData.assignedCanteens || [];
                                                    const updated = e.target.checked
                                                        ? [...current, locationName]
                                                        : current.filter(c => c !== locationName);
                                                    setFormData({ ...formData, assignedCanteens: updated });
                                                }}
                                                style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                                            />
                                            {locationName.toUpperCase()}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="primary-btn"
                        style={{
                            width: '100%',
                            marginTop: '10px',
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                        }}
                        onClick={handleUpdateUser}
                        disabled={isLoading}
                    >
                        {isLoading ? 'SAVING CHANGES...' : 'COMMIT PROFILE UPDATES'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;
