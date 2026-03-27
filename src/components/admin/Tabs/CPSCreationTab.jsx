import '../Admin.css';
import React from 'react';
import { Edit2, Trash2, PauseCircle, PlayCircle, PlusCircle } from 'lucide-react';

const CPSCreationTab = ({
    productionUnits = [],
    setShowEditCPSModal,
    setShowDeleteCPSModal,
    setShowSuspendModal,
    setShowUnsuspendModal,
    setShowCreateCPSModal,
    navigate
}) => {
    return (
        <div className="content-card animate-fadeIn cps-creation-card">
            <div className="cps-creation-header">
                <div className="cps-creation-title">
                    
                </div>
                <div className="cps-creation-actions">
                    <button
                        className="add-canteen-btn cps-action-btn"
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#ffffff', border: 'none', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}
                        onClick={() => setShowEditCPSModal(true)}
                    >
                        <Edit2 size={18} />
                        Edit CPS
                    </button>
                    <button
                        className="delete-canteen-btn cps-action-btn"
                        onClick={() => setShowDeleteCPSModal(true)}
                        style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#ffffff', border: 'none', boxShadow: '0 4px 6px rgba(239, 68, 68, 0.2)' }}
                    >
                        <Trash2 size={18} />
                        Delete CPS
                    </button>
                    <button
                        className="add-canteen-btn cps-action-btn"
                        style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff', border: 'none', boxShadow: '0 4px 6px rgba(245, 158, 11, 0.2)' }}
                        onClick={() => setShowSuspendModal(true)}
                    >
                        <PauseCircle size={18} />
                        SUSPEND
                    </button>
                    <button
                        className="add-canteen-btn cps-action-btn"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', border: 'none', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}
                        onClick={() => setShowUnsuspendModal(true)}
                    >
                        <PlayCircle size={18} />
                        UNSUSPEND
                    </button>
                </div>
            </div>

            <div className="stats-grid cps-creation-grid">
                {productionUnits.map((unit, index) => {
                    const isSuspended = unit.status === 'SUSPENDED';
                    return (
                        <div
                            key={index}
                            className={`stat-card cps-unit-card ${isSuspended ? '' : 'clickable hover:shadow-lg transition-shadow duration-200'}`}
                            style={{
                                cursor: isSuspended ? 'default' : 'pointer',
                                opacity: isSuspended ? 0.5 : 1,
                                filter: isSuspended ? 'grayscale(60%)' : 'none',
                                pointerEvents: isSuspended ? 'none' : 'auto',
                                border: isSuspended ? '1px solid #475569' : undefined
                            }}
                            onClick={() => !isSuspended && navigate('/mess-dashboard', { state: { selectedUnit: unit.name } })}
                            title={isSuspended ? `${unit.name} is suspended` : `Open ${unit.name} Dashboard`}
                        >
                            <div className="stat-header">
                                <div className="stat-icon" style={{ background: isSuspended ? 'rgba(100, 116, 139, 0.1)' : 'rgba(255, 77, 77, 0.1)', color: isSuspended ? '#475569' : '#ff4d4d' }}>
                                    {unit.icon}
                                </div>
                                <span className="stat-change" style={{ color: isSuspended ? '#475569' : '#10b981', fontWeight: 900, fontSize: '0.7rem' }}>
                                    {unit.status || 'ACTIVE'}
                                </span>
                            </div>
                            <div className="stat-body">
                                <h3 className="stat-value" style={{ fontSize: '1.2rem' }}>{unit.name}</h3>
                                <p className="stat-label">{unit.type} UNIT</p>
                            </div>
                        </div>
                    );
                })}

                <div
                    className="stat-card clickable cps-add-unit-card"
                    onClick={() => setShowCreateCPSModal(true)}
                >
                    <div className="cps-add-unit-inner">
                        <PlusCircle size={32} color="#475569" />
                        <p>ADD NEW PRODUCTION UNIT</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CPSCreationTab;
