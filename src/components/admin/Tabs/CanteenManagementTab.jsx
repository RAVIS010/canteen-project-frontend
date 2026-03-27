import '../Admin.css';
import React from 'react';
import { Store, PlusCircle, Trash2 } from 'lucide-react';

const CanteenManagementTab = ({
    canteens = [],
    setShowAddCanteenModal,
    setShowDeleteCanteenModal,
    setSelectedCanteen,
    setCanteenSubTab
}) => {
    return (
        <div className="content-card animate-fadeIn canteen-management-card">
            <div className="canteen-management-header">
                <div className="canteen-management-title">
                    <h2>Canteen Management</h2>
                    <p>Manage all active outlet units and terminals.</p>
                </div>
                <div className="canteen-management-actions">
                    <button
                        className="add-canteen-btn canteen-management-btn"
                        onClick={() => setShowAddCanteenModal(true)}
                    >
                        <PlusCircle size={18} />
                        Add New Canteen
                    </button>
                    <button
                        className="delete-canteen-btn canteen-management-btn"
                        onClick={() => setShowDeleteCanteenModal(true)}
                    >
                        <Trash2 size={18} />
                        Delete Canteen
                    </button>
                </div>
            </div>

            <div className="stats-grid canteen-management-grid">
                {canteens.map((canteen, index) => (
                    <div
                        key={index}
                        className="stat-card clickable hover:shadow-xl transition-all duration-300 canteen-management-unit-card"
                        onClick={() => {
                            setSelectedCanteen(canteen);
                            setCanteenSubTab('billing');
                        }}
                    >
                        <div className="stat-header canteen-management-unit-header">
                            <div className="stat-icon canteen-management-unit-icon">
                                <Store size={24} />
                            </div>
                            <span className="stat-change canteen-management-unit-status">
                                ONLINE
                            </span>
                        </div>
                        <div className="stat-body">
                            <h3 className="stat-value canteen-management-unit-name">{canteen.toUpperCase()}</h3>
                            <p className="stat-label canteen-management-unit-label">OUTLET TERMINAL UNIT</p>
                        </div>
                        <div className="canteen-management-unit-footer">
                            <span>System Active</span>
                            <div className="canteen-management-unit-dot"></div>
                        </div>
                    </div>
                ))}

                <div
                    className="stat-card clickable canteen-management-add-card"
                    onClick={() => setShowAddCanteenModal(true)}
                >
                    <div className="canteen-management-add-inner">
                        <div className="canteen-management-add-icon">
                            <PlusCircle size={28} color="#2563eb" />
                        </div>
                        <p className="canteen-management-add-title">Add New Outlet</p>
                        <p className="canteen-management-add-subtitle">Initialize a new terminal</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CanteenManagementTab;
