import React from 'react';
import './MessDashboard.css';
import {
    ChefHat,
    RotateCcw,
    LogOut,
    Bell,
    Utensils,
    Clock,
    PlusCircle,
    ArrowRightLeft,
    CheckCircle,
    ArrowLeft,
    FileText,
    Menu
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationPanel from '../../User/Tabs/NotificationPanel';

// Sub-components
import ProductionTab from './ProductionTab';
import AddItemsTab from './AddItemsTab';
import ReceiveItemsTab from './ReceiveItemsTab';
import TransferItemsTab from './TransferItemsTab';
import ReturnsTab from './ReturnsTab';
import ReportsTab from './ReportsTab';

// Hooks
import { useMessDashboard } from '../../../hooks/useMessDashboard';

const MessDashboard = ({ isEmbedded = false, adminProductionUnits = [], adminCanteens = [] }) => {
    const navigate = useNavigate();
    const {
        activeTab, setActiveTab,
        currentDate, currentTime,
        userName,
        addItemSuccess, showAddSuccess,
        transferSuccess, showTransferSuccess,
        returnAcceptMsg, showReturnSuccess,
        notifications, showNotifications, setShowNotifications, notificationRef,
        productionUnitsList, globalProductionUnit, setGlobalProductionUnit,
        canteensList,
        productionItems,
        pendingTransfers, acceptedMsg,
        reportSubTab, setReportSubTab,
        reportSearchItem, setReportSearchItem,
        timeFilter, setTimeFilter,
        customStartDate, setCustomStartDate,
        customEndDate, setCustomEndDate,
        handleDownloadExcel, handleDownloadPDF,
        getDailyReportData, getReturnReportData, getDemandReportData,
        handleTransferItem, handleAddItem, handleAcceptReturn, handleDeleteProduction, handleAcceptTransfer,
        handleLogout,
        newItem, setNewItem,
        transferItem, setTransferItem,
        returnItems,
        dynamicCategoryItems
    } = useMessDashboard({ adminProductionUnits, adminCanteens });

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const menuItems = [
        { name: 'Production', icon: <ChefHat size={20} />, id: 'production' },
        { name: 'Add Items', icon: <PlusCircle size={20} />, id: 'add-item' },
        { name: 'Receive Items', icon: <ArrowLeft size={20} />, id: 'receive-items' },
        { name: 'Transfer Items', icon: <ArrowRightLeft size={20} />, id: 'transfer-item' },
        { name: 'Return Items', icon: <RotateCcw size={20} />, id: 'returns' },
        { name: 'Reports', icon: <FileText size={20} />, id: 'reports' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'production':
                return <ProductionTab
                    productionItems={productionItems}
                    handleDeleteProduction={handleDeleteProduction}
                    selectedItemName={newItem.name}
                />;
            case 'receive-items':
                return <ReceiveItemsTab
                    acceptedMsg={acceptedMsg}
                    pendingTransfers={pendingTransfers}
                    handleAcceptTransfer={handleAcceptTransfer}
                />;
            case 'add-item':
                return <AddItemsTab
                    currentDate={currentDate}
                    newItem={newItem}
                    setNewItem={setNewItem}
                    globalProductionUnit={globalProductionUnit}
                    setGlobalProductionUnit={setGlobalProductionUnit}
                    productionUnitsList={productionUnitsList}
                    handleAddItem={handleAddItem}
                    dynamicCategoryItems={dynamicCategoryItems}
                />;
            case 'transfer-item':
                return <TransferItemsTab
                    currentDate={currentDate}
                    transferItem={transferItem}
                    setTransferItem={setTransferItem}
                    globalProductionUnit={globalProductionUnit}
                    setGlobalProductionUnit={setGlobalProductionUnit}
                    productionUnitsList={productionUnitsList}
                    canteensList={canteensList}
                    handleTransferItem={handleTransferItem}
                    dynamicCategoryItems={dynamicCategoryItems}
                />;
            case 'returns':
                return <ReturnsTab
                    returnItems={returnItems}
                    globalProductionUnit={globalProductionUnit}
                    handleAcceptReturn={handleAcceptReturn}
                />;
            case 'reports':
                return <ReportsTab
                    reportSubTab={reportSubTab}
                    setReportSubTab={setReportSubTab}
                    reportSearchItem={reportSearchItem}
                    setReportSearchItem={setReportSearchItem}
                    timeFilter={timeFilter}
                    setTimeFilter={setTimeFilter}
                    customStartDate={customStartDate}
                    setCustomStartDate={setCustomStartDate}
                    customEndDate={customEndDate}
                    setCustomEndDate={setCustomEndDate}
                    handleDownloadExcel={handleDownloadExcel}
                    handleDownloadPDF={handleDownloadPDF}
                    getDailyReportData={getDailyReportData}
                    getReturnReportData={getReturnReportData}
                    getDemandReportData={getDemandReportData}
                />;
            default:
                return null;
        }
    };

    return (
        <div className={`dashboard-container ${isEmbedded ? 'is-embedded' : ''}`}>
            {!isEmbedded && (
                <>
                    {/* Mobile Sidebar Overlay */}
                    {isSidebarOpen && (
                        <div
                            className="sidebar-overlay"
                            onClick={() => setIsSidebarOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                zIndex: 999,
                                backdropFilter: 'blur(4px)'
                            }}
                        ></div>
                    )}
                    <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                        <div className="sidebar-header">
                            <div className="sidebar-logo">
                                <Utensils size={24} color="black" />
                            </div>
                            <span className="logo-text">CENTRAL PRODUCTION SYSTEM</span>
                        </div>

                        <div className="sidebar-nav-scroll">
                            <nav className="sidebar-nav">
                                {menuItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setIsSidebarOpen(false);
                                        }}
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </nav>
                        </div>

                        <div className="sidebar-footer">
                            <div className="profile-card">
                                <div className="avatar">{userName.charAt(0)}</div>
                                <div className="profile-info">
                                    <span className="p-name">{userName}</span>
                                    <span className="p-role">{localStorage.getItem('canteenName') || 'Production'} Operator</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button className="logout-btn" onClick={handleLogout}>
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </>
            )}

            <main className={`main-content ${isEmbedded ? 'embedded-content' : ''}`}>
                {!isEmbedded ? (
                    <header className="content-header">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                                className="mobile-menu-toggle"
                                onClick={() => setIsSidebarOpen(true)}
                                aria-label="Open navigation menu"
                            >
                                <Menu size={20} />
                            </button>
                            <div className="header-title">
                                <p className="text-xs text-muted"><Clock size={12} className="inline mr-1" /> Last Sync: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                            </div>
                        </div>
                        <div className="header-actions flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div className="unit-selector flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="text-sm font-bold text-gray-500 uppercase">Unit:</span>
                                <select
                                    style={{ background: '#222', border: '1px solid #333', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}
                                    value={globalProductionUnit}
                                    onChange={(e) => setGlobalProductionUnit(e.target.value)}
                                >
                                    {productionUnitsList.map(unit => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="header-actions" ref={notificationRef}>
                                <button className="icon-btn relative" onClick={() => setShowNotifications(!showNotifications)}>
                                    <Bell size={20} />
                                    {notifications.length > 0 && (
                                        <span className="notification-dot" style={{ top: '-1px', right: '-1px' }}></span>
                                    )}
                                </button>

                                <NotificationPanel
                                    showNotifications={showNotifications}
                                    setShowNotifications={setShowNotifications}
                                    notifications={notifications}
                                    notificationRef={notificationRef}
                                />
                            </div>
                        </div>
                    </header>
                ) : (
                    <div className="embedded-nav">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                className={`embedded-nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="dashboard-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ flex: 1 }}>
                        {renderContent()}
                    </div>

                    {localStorage.getItem('role') === 'admin' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
                            <button
                                onClick={() => navigate('/admin-dashboard')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 24px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    color: '#475569',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ArrowLeft size={18} />
                                Previous
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Popups */}
            <SuccessPopup show={showAddSuccess} title="ENTRY ADDED!" message={addItemSuccess} />
            <SuccessPopup show={showTransferSuccess} title="TRANSFER COMPLETED!" message={transferSuccess} />
            <SuccessPopup show={showReturnSuccess} title="Request Accepted Successfully" message={returnAcceptMsg} />
        </div>
    );
};

const SuccessPopup = ({ show, title, message }) => {
    if (!show) return null;
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: '#ffffff', border: '1px solid #cbd5e1',
                borderRadius: '20px', padding: '40px 50px',
                textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
                animation: 'fadeIn 0.3s ease',
                minWidth: '320px'
            }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 0 30px rgba(34,197,94,0.4)'
                }}>
                    <CheckCircle size={44} color="#fff" strokeWidth={2.5} />
                </div>
                <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: '900', margin: '0 0 8px', textTransform: 'uppercase' }}>
                    {title}
                </h2>
                <div style={{ color: '#444', fontSize: '1rem', fontWeight: '600', margin: '0 0 6px' }}>
                    {message}
                </div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '16px', fontWeight: '500' }}>
                    This popup will close automatically...
                </p>
            </div>
        </div>
    );
};

export default MessDashboard;
