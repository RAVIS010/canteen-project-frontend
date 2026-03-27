import '../Admin.css';
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import MessDashboard from '../../Mess/Tabs/DashboardTab';

const ProductionViewTab = ({ setActiveTab, productionUnits, canteens }) => {
    return (
        <div className="content-card animate-fadeIn">
            <div className="card-header pb-4 border-b border-[#222]" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ textTransform: 'uppercase', fontWeight: 900 }}>Production Management</h2>
                    <p className="subtitle">Operational view of the Central Production System.</p>
                </div>
                <button className="text-btn" onClick={() => setActiveTab('dashboard')} style={{ color: '#475569', fontWeight: 800 }}>
                    <ChevronLeft size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    BACK TO DASHBOARD
                </button>
            </div>
            <MessDashboard
                isEmbedded={true}
                adminProductionUnits={productionUnits}
                adminCanteens={canteens}
            />
        </div>
    );
};

export default ProductionViewTab;
