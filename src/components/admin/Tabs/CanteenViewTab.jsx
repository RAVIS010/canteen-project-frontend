import '../Admin.css';
import React from 'react';
import { ChevronLeft, ShoppingCart, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, FileText } from 'lucide-react';
import UserDashboard from '../../User/Tabs/UserDashboardTab';

const CanteenViewTab = ({
    selectedCanteen,
    setActiveTab,
    canteenSubTab,
    setCanteenSubTab,
    canteens,
    productionUnits
}) => {
    return (
        <div className="canteen-pos-view animate-fadeIn">
            <div className="pos-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #111' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        className="icon-btn"
                        onClick={() => setActiveTab('dashboard')}
                        style={{ background: '#f1f5f9', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ChevronLeft size={24} color="#0f172a" />
                    </button>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{selectedCanteen?.toUpperCase()} - OUTLET POS</h2>
                        <p style={{ color: '#475569', fontSize: '0.8rem', margin: '4px 0 0 0', fontWeight: 'bold' }}>
                            <span style={{ color: '#44eb44' }}>●</span> SYSTEM ACTIVE: {selectedCanteen?.toUpperCase()}
                        </p>
                    </div>
                </div>
                <div className="pos-sub-nav" style={{ display: 'flex', gap: '8px', background: '#ffffff', padding: '6px', borderRadius: '12px', border: '1px solid #111' }}>
                    {[
                        { id: 'billing', label: 'Billing', icon: <ShoppingCart size={18} /> },
                        { id: 'receive', label: 'Receive Items', icon: <ArrowDownLeft size={18} /> },
                        { id: 'transfer', label: 'Transfer Items', icon: <ArrowLeftRight size={18} /> },
                        { id: 'return', label: 'Return to CPS', icon: <ArrowUpRight size={18} /> },
                        { id: 'reports', label: 'Reports', icon: <FileText size={18} /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setCanteenSubTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                border: 'none',
                                background: canteenSubTab === tab.id ? '#fff' : 'transparent',
                                color: canteenSubTab === tab.id ? '#000' : '#666',
                                fontWeight: '800',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pos-content" style={{ padding: 0, height: 'calc(100vh - 120px)' }}>
                <UserDashboard
                    isEmbedded={true}
                    adminCanteen={selectedCanteen}
                    externalTab={canteenSubTab}
                    adminCanteens={canteens}
                    adminProductionUnits={productionUnits}
                />
            </div>
        </div>
    );
};

export default CanteenViewTab;
