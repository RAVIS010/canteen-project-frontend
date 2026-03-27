import '../Admin.css';
import React from 'react';

const UserCreationTab = ({
    userData,
    handleInputChange,
    handleCreateUser,
    isLoading,
    productionUnits,
    canteens,
    setUserData
}) => {
    return (
        <div className="content-card">
           
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
                    <label style={{ color: '#000000', fontSize: '0.8rem', fontWeight: 800, marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ASSIGNED TO (SELECT MULTIPLE)</label>

                    <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '2px solid #7c3aed' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ color: '#ff4d4d', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>PRODUCTION</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                                {productionUnits.map((unit) => (
                                    <label key={unit.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#000000', fontSize: '0.85rem', fontWeight: 600 }}>
                                        <input
                                            type="checkbox"
                                            checked={userData.assignedCanteens.includes(unit.name)}
                                            onChange={(e) => {
                                                const updated = e.target.checked
                                                    ? [...userData.assignedCanteens, unit.name]
                                                    : userData.assignedCanteens.filter(c => c !== unit.name);
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
                            <p style={{ color: '#ff4d4d', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>CANTEENS</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                                {canteens.map((locationName) => (
                                    <label key={locationName} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#000000', fontSize: '0.85rem', fontWeight: 600 }}>
                                        <input
                                            type="checkbox"
                                            checked={userData.assignedCanteens.includes(locationName)}
                                            onChange={(e) => {
                                                const updated = e.target.checked
                                                    ? [...userData.assignedCanteens, locationName]
                                                    : userData.assignedCanteens.filter(c => c !== locationName);
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
};

export default UserCreationTab;
