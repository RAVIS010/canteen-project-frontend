import '../Admin.css';
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getRoleDisplay } from '../../../utils/adminUtils';

const UserManagementTabs = ({
    activeTab = 'user-creation',
    setActiveTab,
    userData = { name: '', email: '', password: '', role: 'user', assignedCanteens: [] },
    handleInputChange,
    productionUnits = [],
    canteens = [],
    setUserData,
    handleCreateUser,
    isLoading = false,
    users = [],
    fetchUsers,
    handleEditUserClick,
    handleDeleteUser
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (activeTab === 'user-list' && fetchUsers) {
            fetchUsers();
        }
    }, [activeTab, fetchUsers]);

    const filteredUsers = users.filter((user) =>
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        getRoleDisplay(user.role).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.fullName || user.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeTab === 'user-creation') {
        return (
            <div className="content-card user-create-card-medium">
               
                <div className="form-grid">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="dark-field"
                        value={userData.name}
                        onChange={handleInputChange}
                        autoComplete="off"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="dark-field"
                        value={userData.email}
                        onChange={handleInputChange}
                        autoComplete="off"
                    />
                    <select
                        name="role"
                        className="dark-field"
                        value={userData.role}
                        onChange={handleInputChange}
                    >
                        <option value="admin">System Admin</option>
                        <option value="sub-admin">Sub Admin</option>
                        <option value="canteen-manager">Canteen Manager</option>
                        <option value="user">Canteen Staff</option>
                        <option value="mess">Mess Staff</option>
                        {productionUnits.map((unit, idx) => (
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
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="dark-field"
                        value={userData.password}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                    />

                    <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                        <label style={{ color: '#000000', fontSize: '0.8rem', fontWeight: 800, marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            ASSIGNED TO (SELECT MULTIPLE)
                        </label>

                        <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '2px solid #7c3aed' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ color: '#ff4d4d', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                    PRODUCTION
                                </p>
                                <div className="assigned-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                                    {productionUnits.map((unit) => (
                                        <label key={unit.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#000000', fontSize: '0.85rem', fontWeight: 600 }}>
                                            <input
                                                type="checkbox"
                                                checked={userData.assignedCanteens.includes(unit.name)}
                                                onChange={(e) => {
                                                    const updated = e.target.checked
                                                        ? [...userData.assignedCanteens, unit.name]
                                                        : userData.assignedCanteens.filter((c) => c !== unit.name);
                                                    setUserData({ ...userData, assignedCanteens: updated });
                                                }}
                                                style={{ width: '16px', height: '16px', accentColor: '#ff4d4d' }}
                                            />
                                            {unit.name.toUpperCase()}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p style={{ color: '#ff4d4d', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                    CANTEENS
                                </p>
                                <div className="assigned-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                                    {canteens.map((locationName) => (
                                        <label key={locationName} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#000000', fontSize: '0.85rem', fontWeight: 600 }}>
                                            <input
                                                type="checkbox"
                                                checked={userData.assignedCanteens.includes(locationName)}
                                                onChange={(e) => {
                                                    const updated = e.target.checked
                                                        ? [...userData.assignedCanteens, locationName]
                                                        : userData.assignedCanteens.filter((c) => c !== locationName);
                                                    setUserData({ ...userData, assignedCanteens: updated });
                                                }}
                                                style={{ width: '16px', height: '16px', accentColor: '#ff4d4d' }}
                                            />
                                            {locationName.toUpperCase()}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {userData.assignedCanteens.length > 0 && (
                        <div style={{ gridColumn: '1 / -1', marginTop: '10px', padding: '15px', background: 'rgba(255, 77, 77, 0.05)', border: '1px dashed #333', borderRadius: '8px', color: '#ff4d4d', fontSize: '0.9rem', fontWeight: 600 }}>
                            <span style={{ color: '#475569', marginRight: '5px' }}>INFO:</span>
                            The following user is assigned to {userData.assignedCanteens.join(' and ')}
                        </div>
                    )}

                    <button
                        className="primary-btn"
                        style={{ gridColumn: '1 / -1', marginTop: '20px' }}
                        onClick={handleCreateUser}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="table-container">
                <div className="table-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                        {/* User List Title and Badge removed as per user request */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: '#f1f5f9',
                            border: '1.5px solid #2563eb',
                            borderRadius: '10px',
                            padding: '8px 14px',
                            width: '100%',
                            maxWidth: '320px'
                        }}
                    >
                        <Search size={16} color="#2563eb" />
                        <input
                            type="text"
                            placeholder="Search by email or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: '#0f172a',
                                width: '100%'
                            }}
                        />
                    </div>
                </div>

                <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.name || user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className="status-badge pending" style={{ padding: '4px 12px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                                                {getRoleDisplay(user.role)}
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="action-btn-edit"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
                                                    color: 'white',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: '0 2px 4px rgba(58, 123, 213, 0.2)'
                                                }}
                                                onClick={() => handleEditUserClick(user)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="action-btn-delete"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    background: 'linear-gradient(135deg, #ff4d4d 0%, #f73131 100%)',
                                                    color: 'white',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: '0 2px 4px rgba(255, 77, 77, 0.2)'
                                                }}
                                                onClick={() => handleDeleteUser(user._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontWeight: 600 }}>
                                        No users found yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

export default UserManagementTabs;
