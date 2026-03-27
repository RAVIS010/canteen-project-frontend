import React, { useMemo } from 'react';
import {
    LayoutDashboard,
    ArrowUpRight,
    Bell,
    LogOut,
    Package,
    FileText,
    ArrowDownLeft,
    Menu
} from 'lucide-react';
import BillingPOS from '../../billing/Tabs/BillingPOS';
import ReceiveItemsTab from './ReceiveItemsTab';
import TransferItemsTab from './TransferItemsTab';
import ReturnToCPSTab from './ReturnToCPSTab';
import UserReportsTab from './UserReportsTab';
import NotificationPanel from './NotificationPanel';
import SuccessPopups from './SuccessPopups';
import { ReceiptModal, BillingPopup } from './Modals';
import { useUserDashboard } from '../../../hooks/useUserDashboard';
import './UserDashboardTab.css';

const UserDashboardTab = ({ isEmbedded = false, adminCanteen = null, externalTab = null, adminCanteens = [], adminProductionUnits = [] }) => {
    const {
        activeTab, setActiveTab,
        userCanteen, userName,
        items, itemsLoading,
        searchTerm, setSearchTerm,
        cart, setCart,
        cartPaymentMode, setCartPaymentMode,
        showBillingPopup, setShowBillingPopup,
        selectedItem, setSelectedItem,
        popupData, setPopupData,
        showReceipt, setShowReceipt,
        currentReceipt, setCurrentReceipt,
        billCounter, setBillCounter,
        pendingSale, setPendingSale,
        returnForm, setReturnForm,
        returnList, setReturnList,
        returnSuccessMsg, setReturnSuccessMsg,
        showReturnSuccess, setShowReturnSuccess,
        transferForm, setTransferForm,
        transferSearch, setTransferSearch,
        fromSearch, setFromSearch,
        toSearch, setToSearch,
        isDropdownOpen, setIsDropdownOpen,
        isFromDropdownOpen, setIsFromDropdownOpen,
        isToDropdownOpen, setIsToDropdownOpen,
        transferErrors, setTransferErrors,
        showTransferSuccess, setShowTransferSuccess,
        transferSuccessMsg, setTransferSuccessMsg,
        pendingTransfers, setPendingTransfers,
        acceptedMsg, setAcceptedMsg,
        returnHistory, setReturnHistory,
        transferHistory, setTransferHistory,
        showNotifications, setShowNotifications,
        notifications, setNotifications,
        notificationRef,
        reportDuration, setReportDuration,
        reportSearchTerm, setReportSearchTerm,
        reportStats, setReportStats,
        paymentStats, setPaymentStats,
        reportEntries, setReportEntries,
        selectedMetric, setSelectedMetric,
        locations, productionUnits, consolidatedReturnItems,
        handleTransferChange, handleReturnChange, handleSelectStockItem,
        handleSelectFromLocation, handleSelectToLocation, handleTransferSubmit,
        handleAcceptTransfer, handleAddToReturnList, handleRemoveReturnItem,
        handleProcessAllReturns, handleDownloadPDF, handleDownloadExcel,
        handleFinalizeSale, handleLogout,
        handlePopupChange,
        handlePopupSplitChange,
        handlePopupSubmit,
        handleCheckout,
        fetchProducts
    } = useUserDashboard({ isEmbedded, adminCanteen, externalTab, adminCanteens, adminProductionUnits });

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const menuItems = [
        { id: 'billing', name: 'Billing', icon: <LayoutDashboard size={20} /> },
        { id: 'receive', name: 'Receive Items', icon: <ArrowDownLeft size={20} /> },
        { id: 'transfer', name: 'Transfer stock', icon: <ArrowUpRight size={20} /> },
        { id: 'return', name: 'Return to CPS', icon: <Package size={20} /> },
        { id: 'reports', name: 'Reports', icon: <FileText size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'billing':
                return (
                    <BillingPOS
                        products={items}
                        itemsLoading={itemsLoading}
                        isEmbedded={true}
                        onCheckout={handleCheckout}
                    />
                );
            case 'receive':
                return (
                    <ReceiveItemsTab
                        pendingTransfers={pendingTransfers}
                        acceptedMsg={acceptedMsg}
                        handleAcceptTransfer={handleAcceptTransfer}
                    />
                );
            case 'transfer':
                return (
                    <TransferItemsTab
                        items={items}
                        transferSearch={transferSearch}
                        setTransferSearch={setTransferSearch}
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                        handleSelectStockItem={handleSelectStockItem}
                        transferForm={transferForm}
                        handleTransferChange={handleTransferChange}
                        setTransferErrors={setTransferErrors}
                        fromSearch={fromSearch}
                        toSearch={toSearch}
                        setToSearch={setToSearch}
                        isToDropdownOpen={isToDropdownOpen}
                        setIsToDropdownOpen={setIsToDropdownOpen}
                        locations={locations}
                        handleSelectToLocation={handleSelectToLocation}
                        handleTransferSubmit={handleTransferSubmit}
                        transferHistory={transferHistory}
                        userCanteen={userCanteen}
                    />
                );
            case 'return':
                return (
                    <ReturnToCPSTab
                        returnForm={returnForm}
                        handleReturnChange={handleReturnChange}
                        consolidatedReturnItems={consolidatedReturnItems}
                        productionUnits={productionUnits}
                        handleAddToReturnList={handleAddToReturnList}
                        returnList={returnList}
                        handleRemoveReturnItem={handleRemoveReturnItem}
                        handleProcessAllReturns={handleProcessAllReturns}
                        setReturnList={setReturnList}
                        returnHistory={returnHistory}
                        userCanteen={userCanteen}
                    />
                );
            case 'reports': {
                const uniqueAvailableCount = items
                    .filter(item => item.stock > 0)
                    .reduce((acc, item) => {
                        const key = `${(item.name || '').trim().toUpperCase()}-${item.price}`;
                        acc.add(key);
                        return acc;
                    }, new Set()).size;

                return (
                    <UserReportsTab
                        reportSearchTerm={reportSearchTerm}
                        setReportSearchTerm={setReportSearchTerm}
                        reportEntries={reportEntries}
                        reportDuration={reportDuration}
                        setReportDuration={setReportDuration}
                        paymentStats={paymentStats}
                        selectedMetric={selectedMetric}
                        setSelectedMetric={setSelectedMetric}
                        handleDownloadPDF={handleDownloadPDF}
                        handleDownloadExcel={handleDownloadExcel}
                        userCanteen={userCanteen}
                        availableItemsCount={uniqueAvailableCount}
                    />
                );
            }
            default:
                return null;
        }
    };

    return (
        <div className={`user-dashboard-container ${isEmbedded ? 'is-embedded' : ''}`}>
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
                    <aside className={`sidebar sidebar-responsive ${isSidebarOpen ? 'open' : ''}`}>
                        <div className="sidebar-header">
                            <div className="logo-box">
                                <div className="logo-icon">C</div>
                                <span className="logo-text">CMS <span>USER</span></span>
                            </div>
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
                                <div className="profile-badge">{userCanteen?.charAt(0) || 'C'}</div>
                                <div className="profile-info">
                                    <span className="p-name">{localStorage.getItem('name') || 'Canteen Operator'}</span>
                                    <span className="p-role">{userCanteen} Operator</span>
                                </div>
                            </div>
                            <button className="logout-btn" onClick={handleLogout}>
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </aside>
                </>
            )}

            <main className="main-content" style={{
                padding: isEmbedded ? 0 : (['billing', 'reports'].includes(activeTab) ? '0' : '24px'),
                width: '100%',
                maxWidth: '100vw',
                overflowX: 'hidden',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Always show header in main dashboard, even for billing */}
                {!isEmbedded && (
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
                                {/* Title can go here if needed */}
                            </div>
                        </div>
                        <div className="header-actions" ref={notificationRef}>
                            <button className="icon-btn relative" onClick={() => setShowNotifications(!showNotifications)}>
                                <Bell size={20} />
                                {notifications.length > 0 && <span className="notification-dot"></span>}
                            </button>

                            <NotificationPanel
                                showNotifications={showNotifications}
                                setShowNotifications={setShowNotifications}
                                notifications={notifications}
                                notificationRef={notificationRef}
                            />
                        </div>
                    </header>
                )}

                <div className="dashboard-body">
                    {renderContent()}
                </div>
            </main>

            {/* Modals & Popups */}
            <BillingPopup
                showBillingPopup={showBillingPopup}
                setShowBillingPopup={setShowBillingPopup}
                selectedItem={selectedItem}
                popupData={popupData}
                handlePopupChange={handlePopupChange}
                handlePopupSplitChange={handlePopupSplitChange}
                handlePopupSubmit={handlePopupSubmit}
            />

            <ReceiptModal
                showReceipt={showReceipt}
                setShowReceipt={setShowReceipt}
                currentReceipt={currentReceipt}
                handleFinalizeSale={handleFinalizeSale}
            />

            <SuccessPopups
                showTransferSuccess={showTransferSuccess}
                transferSuccessMsg={transferSuccessMsg}
                showReturnSuccess={showReturnSuccess}
                returnSuccessMsg={returnSuccessMsg}
                userName={userName}
            />
        </div>
    );
};

export default UserDashboardTab;
