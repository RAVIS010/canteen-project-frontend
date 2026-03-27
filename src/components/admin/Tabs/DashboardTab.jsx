import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
    LayoutDashboard,
    Users,
    Package,
    History,
    FileText,
    LogOut,
    Coffee,
    ArrowRightLeft,
    Clock,
    Search,
    Bell,
    ChevronDown,
    PlusCircle,
    TrendingUp,
    Store,
    Trash2,
    Activity,
    Menu,
    ShoppingBag,
    Printer,
    ArrowLeftRight,
    UtensilsCrossed,
    UserPlus,
    BarChart3,
    Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Import Tab Components
import UserManagementTabs from './UserManagementTabs';
import AdminLogsTab from './AdminLogsTab';
import ProductCategoryTab from './ProductCategoryTab';
import SalesReportsTab from './SalesReportsTab';
import CPSCreationTab from './CPSCreationTab';
import CanteenViewTab from './CanteenViewTab';
import TransferHistoryTab from './TransferHistoryTab';
import BillingTab from './BillingTab';
import LiveSalesTab from './LiveSalesTab';
import ProductionViewTab from './ProductionViewTab';
import CanteenManagementTab from './CanteenManagementTab';
import { formatLocation } from '../../../utils/adminUtils';
import NotificationPanel from '../../User/Tabs/NotificationPanel';

// Import Modals
import EditUserModal from '../Modals/EditUserModal';
import {
    EditCPSModal,
    DeleteCPSModal,
    SuspendModal,
    UnsuspendModal,
    CreateCPSModal
} from '../Modals/CPSModals';
import {
    AddCanteenModal,
    DeleteCanteenModal
} from '../Modals/CanteenModals';
import ConfirmationModal from '../Modals/ConfirmationModal';
import BillsBreakdownModal from '../Modals/BillsBreakdownModal';

// Import CSS
import '../Admin.css';
import '../AdminResponsive.css';

const DashboardTab = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedCanteen, setSelectedCanteen] = useState(null);
    const [canteenSubTab, setCanteenSubTab] = useState('billing');

    // System States
    const [users, setUsers] = useState([]);
    const [sessionLogs, setSessionLogs] = useState([]);
    const [showBillsModal, setShowBillsModal] = useState(false);
    const [dashboardStats, setDashboardStats] = useState({
        totalRevenue: 0,
        totalBills: 0,
        billsBreakdown: []
    });

    // Persistent Canteens & Production Units (Now dynamic from backend)
    const [canteens, setCanteens] = useState([]);
    const [productionUnits, setProductionUnits] = useState([]);

    // Sync to LocalStorage (Keeping as fallback for user convenience but backend is primary)
    useEffect(() => {
        if (canteens.length > 0) {
            localStorage.setItem('cms_canteens', JSON.stringify(canteens));
            localStorage.setItem('adminCanteens', JSON.stringify(canteens));
        }
    }, [canteens]);

    useEffect(() => {
        if (productionUnits.length > 0) {
            const serializable = productionUnits.map(({ icon, ...rest }) => rest);
            localStorage.setItem('cms_production_units', JSON.stringify(serializable));
            localStorage.setItem('adminProductionUnits', JSON.stringify(serializable));
        }
    }, [productionUnits]);



    // Dashboard Stats Derived State
    const stats = [
        { label: 'TOTAL REVENUE', value: `₹ ${dashboardStats.totalRevenue.toLocaleString()}`, icon: <TrendingUp size={20} />, change: 'Today', path: null },
        { label: 'TOTAL BILLS', value: dashboardStats.totalBills.toString(), icon: <FileText size={20} />, change: 'Breakdown', path: null, triggerModal: 'bills' },
        { label: 'PRODUCTION', value: `${productionUnits.length} Units`, icon: <Coffee size={20} />, change: 'Running', tab: 'cps-creation' },
        { label: 'CANTEENS', value: `${canteens.length} Active`, icon: <Store size={20} />, change: 'Online', tab: 'canteen-management' }
    ];


    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddCanteenModal, setShowAddCanteenModal] = useState(false);
    const [showDeleteCanteenModal, setShowDeleteCanteenModal] = useState(false);
    const [showCreateCPSModal, setShowCreateCPSModal] = useState(false);
    const [showEditCPSModal, setShowEditCPSModal] = useState(false);
    const [showDeleteCPSModal, setShowDeleteCPSModal] = useState(false);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [productToRemove, setProductToRemove] = useState(null);
    const [showCategoryDeleteConfirm, setShowCategoryDeleteConfirm] = useState(false);
    const [showProductRemoveConfirm, setShowProductRemoveConfirm] = useState(false);
    const [calendarFilter, setCalendarFilter] = useState(null);
    const [logSearchTerm, setLogSearchTerm] = useState('');
    const [showUserLoginStats, setShowUserLoginStats] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const notificationRef = React.useRef(null);
    const profileRef = React.useRef(null);

    // Sales Report Specific States
    const [canteenSalesHistory, setCanteenSalesHistory] = useState([]);
    const [reportFilterCategory, setReportFilterCategory] = useState('');
    const [reportFilterProduct, setReportFilterProduct] = useState('');
    const [itemSearchQuery, setItemSearchQuery] = useState('');
    const [reportFilterLocation, setReportFilterLocation] = useState('');
    const [reportFilterBiller, setReportFilterBiller] = useState('');
    const [reportFilterFromDate, setReportFilterFromDate] = useState('');
    const [reportFilterToDate, setReportFilterToDate] = useState('');
    const [reportViewMode, setReportViewMode] = useState('Log'); // 'Log' or 'Summary'
    const [globalUnit, setGlobalUnit] = useState('');

    useEffect(() => {
        if (!globalUnit && canteens.length > 0) {
            setGlobalUnit(canteens[0]);
        }
    }, [canteens, globalUnit]);

    // Form State for User Creation
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        assignedCanteens: []
    });

    // Product & Category Management
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '' });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchInitialData();

        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            clearInterval(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchDashboardStats = useCallback(async () => {
        try {
            const data = await api.get('/reports/dashboard-stats');
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                setDashboardStats(data);
            }
        } catch (err) {
            console.error('Failed to refresh dashboard stats:', err.message);
        }
    }, []);

    const handleDeleteBills = async (canteenLocation) => {
        try {
            await api.delete(`/sales/canteen/${encodeURIComponent(canteenLocation)}`);
            toast.success(`Bills for "${canteenLocation}" deleted`);
            await fetchDashboardStats(); // refresh the breakdown + total
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete bills');
        }
    };

    const fetchInitialData = useCallback(async () => {
        // Fetch independently so one failure doesn't block others
        const safeGet = async (path, setter, fallback = []) => {
            try {
                const data = await api.get(path);
                // If fallback is an array, ensure data is an array. If fallback is an object, ensure data is an object.
                if (Array.isArray(fallback)) {
                    setter(Array.isArray(data) ? data : fallback);
                } else {
                    setter(data && typeof data === 'object' && !Array.isArray(data) ? data : fallback);
                }
            } catch (err) {
                console.error(`Failed to fetch ${path}:`, err.message);
                setter(fallback);
            }
        };

        await Promise.all([
            safeGet('/users', setUsers),
            safeGet('/session-logs', setSessionLogs),
            safeGet('/categories', setCategories),
            safeGet('/products', setAllProducts),
            safeGet('/transfers', setTransfers),
            safeGet('/sales', setCanteenSalesHistory),
            safeGet('/reports/dashboard-stats', setDashboardStats, { totalRevenue: 0, totalBills: 0, billsBreakdown: [] }),
            (async () => {
                try {
                    const data = await api.get('/canteens');
                    if (Array.isArray(data)) {
                        const cArr = data.filter(item => item.type === 'CANTEEN').map(c => c.name);
                        const pArr = data.filter(item => item.type === 'PRODUCTION').map(p => ({
                            ...p,
                            icon: <Coffee size={24} />
                        }));
                        setCanteens(cArr);
                        setProductionUnits(pArr);
                    }
                } catch (err) {
                    console.error('Failed to fetch canteens:', err.message);
                }
            })()
        ]);
    }, []);

    const handleLogout = () => {
        // Clear session specific data only
        const keysToRemove = [
            'token',
            'role',
            'name',
            'sessionId',
            'canteenName',
            'assignedCanteens',
            'lastSelectedUnit'
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));
        navigate('/login');
    };

    const handleAddCanteen = async (canteenData) => {
        if (!canteenData || !canteenData.name) return;
        const normalizedName = canteenData.name.trim();
        if (canteens.some(c => c.toLowerCase() === normalizedName.toLowerCase())) {
            return toast.error('Canteen name already exists');
        }
        try {
            await api.post('/canteens', { 
                name: normalizedName, 
                location: canteenData.location, 
                type: 'CANTEEN' 
            });
            toast.success(`Successfully added ${normalizedName}`);
            setShowAddCanteenModal(false);
            fetchInitialData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add canteen');
        }
    };

    const handleDeleteCanteen = async (name) => {
        try {
            await api.delete(`/canteens/${encodeURIComponent(name)}`);
            toast.success(`Successfully removed ${name}`);
            setShowDeleteCanteenModal(false);
            fetchInitialData();
        } catch (error) {
            toast.error('Failed to remove canteen');
        }
    };

    const handleCreateUser = async () => {
        if (!userData.email || !userData.name || !userData.password) {
            return toast.error('Please fill all required fields');
        }
        setIsLoading(true);
        try {
            await api.post('/register', userData);
            toast.success('User created successfully');
            setUserData({ name: '', email: '', password: '', role: 'user', assignedCanteens: [] });
            await fetchInitialData();
            setActiveTab('user-list');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Category Handlers
    const handleAddCategory = async (name) => {
        try {
            await api.post('/categories', { name });
            toast.success('Category created');
            fetchInitialData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create category');
        }
    };

    const handleDeleteCategory = (id) => {
        setCategoryToDelete(id);
        setShowCategoryDeleteConfirm(true);
    };

    const confirmDeleteCategory = async () => {
        try {
            await api.delete(`/categories/${categoryToDelete}`);
            toast.success('Category deleted');
            fetchInitialData();
        } catch (error) {
            toast.error('Delete failed');
        } finally {
            setShowCategoryDeleteConfirm(false);
            setCategoryToDelete(null);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.category) {
            return toast.error('Fill all product fields');
        }
        try {
            await api.post('/products', {
                name: newProduct.name,
                category: newProduct.category,
                price: parseFloat(newProduct.price) || 0,
                location: 'Central mess'
            });
            toast.success('Product added to category');
            setNewProduct({ name: '', category: '', price: '' });
            fetchInitialData();
        } catch (error) {
            toast.error('Failed to add product');
        }
    };

    const handleRemoveProduct = async () => {
        if (!newProduct.name) return toast.error('Select or enter product name to remove');
        const prod = allProducts.find(p => p.name.toUpperCase() === newProduct.name.toUpperCase());
        if (!prod) return toast.error('Product not found');

        setProductToRemove(prod);
        setShowProductRemoveConfirm(true);
    };

    const confirmRemoveProduct = async () => {
        try {
            await api.delete(`/products/${productToRemove._id}`);
            toast.success('Product removed');
            fetchInitialData();
        } catch (error) {
            toast.error('Removal failed');
        } finally {
            setShowProductRemoveConfirm(false);
            setProductToRemove(null);
        }
    };

    const handleDeleteSale = async (saleId) => {
        if (!window.confirm('Are you sure you want to delete this sales record?')) return;
        try {
            await api.delete(`/sales/${saleId}`);
            toast.success('Sale record deleted');
            fetchInitialData();
        } catch (error) {
            toast.error('Failed to delete sale record');
        }
    };

    const handleExportSalesExcel = (filteredData, consolidatedData, mode) => {
        try {
            const toastId = toast.loading('Preparing Excel download...');
            
            let dataToExport = [];
            let fileName = "";

            if (mode === 'Log') {
                fileName = `Sales_Transaction_Log_${new Date().getTime()}.xlsx`;
                dataToExport = filteredData.map(sale => ({
                    'Date & Time': new Date(sale.createdAt).toLocaleString(),
                    'Location': sale.location,
                    'Product': sale.productName,
                    'Quantity': sale.sold,
                    'Unit Price': sale.price,
                    'Total': sale.sold * sale.price,
                    'Payment Mode': sale.paymentMode,
                    'Biller': sale.operatorName || '-'
                }));
            } else {
                fileName = `Sales_Item_Summary_${new Date().getTime()}.xlsx`;
                dataToExport = consolidatedData.map(item => ({
                    'Category': item.category || '-',
                    'Product': item.productName,
                    'Location': item.location,
                    'Total Quantity': item.totalQty,
                    'Average Price': item.lastPrice,
                    'Total Value': item.totalValue
                }));
            }

            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
            XLSX.writeFile(wb, fileName);

            toast.success('Excel report downloaded successfully!', { id: toastId });
        } catch (error) {
            console.error('Excel Export Error:', error);
            toast.error('Failed to download Excel report');
        }
    };


    const handleClearAllSessionLogs = async () => {
        if (!window.confirm('Are you sure you want to clear all session logs? This cannot be undone.')) return;
        try {
            await api.delete('/session-logs/all');
            toast.success('All session logs cleared');
            fetchInitialData();
        } catch (error) {
            toast.error('Failed to clear session logs');
        }
    };

    const handleDeleteSessionLog = async (id) => {
        if (!window.confirm('Delete this session log?')) return;
        try {
            await api.delete(`/session-logs/${id}`);
            toast.success('Session log deleted');
            fetchInitialData();
        } catch (error) {
            toast.error('Failed to delete session log');
        }
    };

    const handleExportSalesPDF = (filteredData, consolidatedData, mode) => {
        try {
            if (mode === 'Log' && (!filteredData || filteredData.length === 0)) {
                return toast.error('No transaction data available to export');
            }
            if (mode === 'Summary' && (!consolidatedData || consolidatedData.length === 0)) {
                return toast.error('No summary data available to export');
            }

            const doc = new jsPDF({ orientation: 'landscape' });
            doc.text(`Sales Report - ${mode}`, 14, 15);
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

            if (mode === 'Log') {
                const tableColumn = ["Date & Time", "Location", "Product", "Qty", "Price", "Total", "Payment", "Biller"];
                const tableRows = [];

                filteredData.forEach(sale => {
                    const saleData = [
                        new Date(sale.createdAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
                        sale.location,
                        sale.productName,
                        sale.sold,
                        `Rs. ${sale.price}`,
                        `Rs. ${sale.sold * sale.price}`,
                        sale.paymentMode,
                        sale.operatorName || '-'
                    ];
                    tableRows.push(saleData);
                });

                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 30,
                    theme: 'grid',
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [37, 99, 235] }
                });
            } else {
                const tableColumn = ["Category", "Product", "Location", "Total Qty", "Avg Price", "Total Value"];
                const tableRows = [];

                consolidatedData.forEach(item => {
                    const itemData = [
                        item.category || '-',
                        item.productName,
                        item.location,
                        item.totalQty,
                        `Rs. ${item.lastPrice}`,
                        `Rs. ${item.totalValue}`
                    ];
                    tableRows.push(itemData);
                });

                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 30,
                    theme: 'grid',
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [22, 101, 52] },
                    foot: [["", "", "GRAND TOTAL", consolidatedData.reduce((s, i) => s + i.totalQty, 0), "", `Rs. ${consolidatedData.reduce((s, i) => s + i.totalValue, 0)}`]],
                    footStyles: { fillColor: [248, 250, 252], textColor: [0, 0, 0], fontStyle: 'bold' }
                });
            }

            doc.save(`Sales_Report_${mode}_${new Date().getTime()}.pdf`);
            toast.success('PDF report downloaded successfully!');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            toast.error('Failed to generate PDF report');
        }
    };

    // Transform raw data for Category Tab
    const localProductCategories = categories.map(cat => {
        // Group by name to get unique products within this category
        const productMap = {};
        allProducts
            .filter(p => p.category === cat.name)
            .forEach(p => {
                const name = (p.name || '').toUpperCase();
                // If it's a "Central mess" record, prioritize its price as the template price
                if (!productMap[name] || p.location?.toLowerCase() === 'central mess') {
                    productMap[name] = {
                        name: name,
                        price: p.price
                    };
                }
            });

        return {
            id: cat._id,
            category: cat.name,
            items: Object.values(productMap)
        };
    });

    const formattedNotifications = transfers.map(t => ({
        id: t._id,
        item: t.item || t.itemName,
        from: t.from,
        to: t.to,
        qty: t.quantity,
        status: t.status,
        time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(t.createdAt).toLocaleDateString()
    }));

    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'cps-creation', name: 'CPS Creation', icon: <PlusCircle size={20} />, isSubOption: true },
        { id: 'canteen-management', name: 'Canteen Management', icon: <Store size={20} />, isSubOption: true },
        { id: 'user-creation', name: 'User Creation', icon: <UserPlus size={20} /> },
        { id: 'user-list', name: 'User List', icon: <Users size={20} /> },
        { id: 'transfer-history', name: 'Transfer History', icon: <History size={20} /> },
        { id: 'sales-reports', name: 'Sales Reports', icon: <BarChart3 size={20} /> },
        { id: 'product-categories', name: 'Product Category', icon: <Layers size={20} /> },
        { id: 'admin-logs', name: 'Admin Logs', icon: <History size={20} /> },
        { id: 'live-sales', name: 'Live Sales', icon: <Activity size={20} /> }
    ];

    const renderDashboardOverview = (stats, setActiveTab, setSelectedCanteen, setCanteenSubTab, navigate) => (
        <>
            <div className="welcome-section">
                <div>
                    <h1>Dashboard </h1>
                </div>
            </div>


            <div className="stats-grid responsive-grid responsive-grid-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`stat-card ${(stat.path || stat.tab) ? 'clickable' : ''}`}
                        onClick={() => {
                            if (stat.triggerModal === 'bills') {
                                setShowBillsModal(true);
                            }
                            else if (stat.tab) {
                                setActiveTab(stat.tab);
                                if (stat.canteenName) {
                                    setSelectedCanteen(stat.canteenName);
                                    setCanteenSubTab('receive');
                                }
                            }
                            else if (stat.path) navigate(stat.path);
                        }}
                        style={{ cursor: (stat.path || stat.tab || stat.triggerModal) ? 'pointer' : 'default' }}
                    >
                        <div className="stat-header">
                            <div className="stat-icon">{stat.icon}</div>
                            <span className="stat-change" style={(stat.label === 'PRODUCTION' || stat.label === 'CANTEEN 1' || stat.label === 'S BLOCK') ? { color: '#44eb44', fontWeight: 900, fontSize: '0.7rem', animation: 'pulse 1.5s infinite' } : {}}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="stat-body">
                            <h3 className="stat-value">{stat.value}</h3>
                            <p className="stat-label">{stat.label}</p>
                            {stat.extra && <p className="stat-extra-info">{stat.extra}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );


    const renderContent = () => {
        if (selectedCanteen) {
            return (
                <CanteenViewTab
                    selectedCanteen={selectedCanteen}
                    setActiveTab={(tab) => {
                        if (tab === 'dashboard') setSelectedCanteen(null);
                        setActiveTab(tab);
                    }}
                    canteenSubTab={canteenSubTab}
                    setCanteenSubTab={setCanteenSubTab}
                    canteens={canteens}
                    productionUnits={productionUnits}
                />
            );
        }

        switch (activeTab) {
            case 'dashboard':
                return renderDashboardOverview(stats, setActiveTab, setSelectedCanteen, setCanteenSubTab, navigate);
            case 'user-creation':
            case 'user-list':
                return (
                    <UserManagementTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        userData={userData}
                        handleInputChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })}
                        productionUnits={productionUnits}
                        canteens={canteens}
                        setUserData={setUserData}
                        handleCreateUser={handleCreateUser}
                        isLoading={isLoading}
                        users={users}
                        fetchUsers={fetchInitialData}
                        handleEditUserClick={(user) => { setSelectedUser(user); setShowEditUserModal(true); }}
                        handleDeleteUser={(id) => {
                            setUserToDelete(id);
                            setShowDeleteConfirm(true);
                        }}
                    />
                );
            case 'product-categories':
                return (
                    <ProductCategoryTab
                        localProductCategories={localProductCategories}
                        newProduct={newProduct}
                        setNewProduct={setNewProduct}
                        handleAddProduct={handleAddProduct}
                        handleRemoveProduct={handleRemoveProduct}
                        handleAddCategory={handleAddCategory}
                        handleDeleteCategory={handleDeleteCategory}
                    />
                );
            case 'cps-creation':
                return (
                    <CPSCreationTab
                        productionUnits={productionUnits}
                        setShowEditCPSModal={setShowEditCPSModal}
                        setShowDeleteCPSModal={setShowDeleteCPSModal}
                        setShowSuspendModal={setShowSuspendModal}
                        setShowUnsuspendModal={setShowUnsuspendModal}
                        setShowCreateCPSModal={setShowCreateCPSModal}
                        navigate={navigate}
                    />
                );
            case 'canteen-management':
                return (
                    <CanteenManagementTab
                        canteens={canteens}
                        setShowAddCanteenModal={setShowAddCanteenModal}
                        setShowDeleteCanteenModal={setShowDeleteCanteenModal}
                        setSelectedCanteen={setSelectedCanteen}
                        setCanteenSubTab={setCanteenSubTab}
                    />
                );
            case 'live-sales':
                return (
                    <LiveSalesTab
                        transfers={transfers}
                        canteens={canteens}
                        productionUnits={productionUnits}
                        allProducts={allProducts}
                    />
                );
            case 'sales-reports':
                return (
                    <SalesReportsTab
                        canteenSalesHistory={canteenSalesHistory}
                        localProductCategories={localProductCategories}
                        reportFilterCategory={reportFilterCategory}
                        setReportFilterCategory={setReportFilterCategory}
                        reportFilterProduct={reportFilterProduct}
                        setReportFilterProduct={setReportFilterProduct}
                        itemSearchQuery={itemSearchQuery}
                        setItemSearchQuery={setItemSearchQuery}
                        reportFilterLocation={globalUnit || reportFilterLocation}
                        setReportFilterLocation={setReportFilterLocation}
                        reportFilterBiller={reportFilterBiller}
                        setReportFilterBiller={setReportFilterBiller}
                        reportFilterFromDate={reportFilterFromDate}
                        setReportFilterFromDate={setReportFilterFromDate}
                        reportFilterToDate={reportFilterToDate}
                        setReportFilterToDate={setReportFilterToDate}
                        calendarFilter={calendarFilter}
                        setCalendarFilter={setCalendarFilter}
                        reportViewMode={reportViewMode}
                        setReportViewMode={setReportViewMode}
                        handleExportSalesExcel={handleExportSalesExcel}
                        handleExportSalesPDF={handleExportSalesPDF}
                        handleDeleteSale={handleDeleteSale}
                        users={users}
                        canteens={canteens}
                        productionUnits={productionUnits}
                    />
                );
            case 'transfer-history':
                return (
                    <TransferHistoryTab
                        calendarFilter={calendarFilter}
                        setCalendarFilter={setCalendarFilter}
                    />
                );
            case 'admin-logs':
                return (
                    <AdminLogsTab
                        sessionLogs={sessionLogs}
                        logSearchTerm={logSearchTerm}
                        setLogSearchTerm={setLogSearchTerm}
                        showUserLoginStats={showUserLoginStats}
                        setShowUserLoginStats={setShowUserLoginStats}
                        handleClearAllSessionLogs={handleClearAllSessionLogs}
                        handleDeleteSessionLog={handleDeleteSessionLog}
                    />
                );
            default:
                return renderDashboardOverview(stats, setActiveTab, setSelectedCanteen, setCanteenSubTab, navigate);
        }
    };

    const updateProductionUnits = async (newUnits) => {
        // Since original logic was synchronous and used functional updates or arrays,
        // we need to adapt it. If newUnits is a function, we apply it.
        // But for truly dynamic management, we should have specific actions (create/update/delete).
        // For simplicity and matching current modal patterns, let's keep it somewhat synced.
        fetchInitialData();
    };

    return (
        <div className="dashboard-container">
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

            {/* Sidebar */}
            <aside className={`sidebar sidebar-responsive ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Coffee size={24} color="#2563eb" />
                    </div>
                    <span className="logo-text">CMS ADMIN</span>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className={`nav-item 
                                ${activeTab === item.id && !selectedCanteen ? 'active' : ''} 
                                ${item.id === 'dashboard' ? 'dashboard-special' : ''} 
                                ${item.isSubOption ? 'sub-option' : ''}
                            `}
                            onClick={() => {
                                setSelectedCanteen(null);
                                setActiveTab(item.id);
                                setIsSidebarOpen(false); // Close sidebar on mobile after selection
                            }}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </div>
                    ))}
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className={`main-content ${activeTab === 'user-creation' ? 'main-content-fixed' : ''}`}>
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
                            <h1>{selectedCanteen ? selectedCanteen.toUpperCase() : activeTab.replace('-', ' ').toUpperCase()}</h1>
                            <p>{currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {['dashboard', 'live-sales'].includes(activeTab) && (
                            <div className="unit-selector-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                <Store size={16} color="#64748b" />
                                <select
                                    value={globalUnit}
                                    onChange={(e) => setGlobalUnit(e.target.value)}
                                    style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', outline: 'none', cursor: 'pointer' }}
                                >
                                    <option value="">All Canteens</option>
                                     {canteens.map(loc => (
                                        <option key={loc} value={loc}>{formatLocation(loc).toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {['user-creation', 'user-list'].includes(activeTab) && (
                            <div className="user-header-switch">
                                <button
                                    type="button"
                                    className={`user-header-switch-btn ${activeTab === 'user-creation' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('user-creation')}
                                >
                                    User Create
                                </button>
                                <button
                                    type="button"
                                    className={`user-header-switch-btn ${activeTab === 'user-list' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('user-list')}
                                >
                                    UserList
                                </button>
                            </div>
                        )}

                        <div className="header-actions" ref={notificationRef}>
                            <button className="icon-btn relative" onClick={() => setShowNotifications(!showNotifications)}>
                                <Bell size={20} />
                                {formattedNotifications.filter(n => n.status === 'Pending').length > 0 && <span className="notification-dot"></span>}
                            </button>
                            <NotificationPanel
                                showNotifications={showNotifications}
                                setShowNotifications={setShowNotifications}
                                notifications={formattedNotifications}
                                notificationRef={notificationRef}
                            />
                        </div>

                        <div className="profile-group" ref={profileRef}>
                            <div className="profile-btn" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                                <div className="avatar">A</div>
                                <span>{localStorage.getItem('name') || 'ADMIN'}</span>
                                <ChevronDown size={14} style={{ transform: showProfileDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </div>

                            {showProfileDropdown && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-user-info">
                                        <h4>{localStorage.getItem('name') || 'ADMIN'}</h4>
                                    </div>
                                    <div className="dropdown-menu">
                                        <div className="dropdown-menu-item" onClick={() => setShowProfileDropdown(false)}>
                                            <div className="item-icon">
                                                <Users size={20} />
                                            </div>
                                            <span>Your Profile</span>
                                        </div>
                                        <div className="dropdown-menu-item" onClick={handleLogout}>
                                            <div className="item-icon">
                                                <LogOut size={20} />
                                            </div>
                                            <span>Sign out</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className={`dashboard-body ${activeTab === 'user-creation' ? 'dashboard-body-fixed' : ''}`}>
                    {renderContent()}
                </div>
            </main>

            {/* Modals */}
            {showEditUserModal && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setShowEditUserModal(false)}
                    onUpdate={fetchInitialData}
                    canteens={canteens}
                    productionUnits={productionUnits}
                />
            )}
            <AddCanteenModal
                showAddCanteenModal={showAddCanteenModal}
                setShowAddCanteenModal={setShowAddCanteenModal}
                confirmAddCanteen={handleAddCanteen}
            />
            <DeleteCanteenModal
                showDeleteModal={showDeleteCanteenModal}
                setShowDeleteModal={setShowDeleteCanteenModal}
                canteens={canteens}
                confirmDeleteCanteen={handleDeleteCanteen}
            />
            <CreateCPSModal
                showCreateCPSModal={showCreateCPSModal}
                setShowCreateCPSModal={setShowCreateCPSModal}
                setProductionUnits={updateProductionUnits}
            />
            <EditCPSModal
                showEditCPSModal={showEditCPSModal}
                setShowEditCPSModal={setShowEditCPSModal}
                productionUnits={productionUnits}
                setProductionUnits={updateProductionUnits}
            />
            <DeleteCPSModal
                showDeleteCPSModal={showDeleteCPSModal}
                setShowDeleteCPSModal={setShowDeleteCPSModal}
                productionUnits={productionUnits}
                setProductionUnits={updateProductionUnits}
            />
            <SuspendModal
                showSuspendModal={showSuspendModal}
                setShowSuspendModal={setShowSuspendModal}
                productionUnits={productionUnits}
                setProductionUnits={updateProductionUnits}
            />
            <UnsuspendModal
                showUnsuspendModal={showUnsuspendModal}
                setShowUnsuspendModal={setShowUnsuspendModal}
                productionUnits={productionUnits}
                setProductionUnits={updateProductionUnits}
            />

            <ConfirmationModal
                show={showDeleteConfirm}
                title="Confirm Deletion"
                message="Are you sure you want to permanently delete this user? This action cannot be undone."
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                }}
                onConfirm={async () => {
                    try {
                        await api.delete(`/users/${userToDelete}`);
                        toast.success('User deleted successfully');
                        fetchInitialData();
                    } catch (error) {
                        toast.error('Failed to delete user');
                        console.error('Delete error:', error);
                    } finally {
                        setShowDeleteConfirm(false);
                        setUserToDelete(null);
                    }
                }}
                confirmText="DELETE USER"
                type="danger"
            />

            <ConfirmationModal
                show={showCategoryDeleteConfirm}
                title="Delete Category"
                message="Are you sure you want to delete this category? All associations will be removed."
                onCancel={() => {
                    setShowCategoryDeleteConfirm(false);
                    setCategoryToDelete(null);
                }}
                onConfirm={confirmDeleteCategory}
                confirmText="DELETE CATEGORY"
                type="danger"
            />

            <ConfirmationModal
                show={showProductRemoveConfirm}
                title="Remove Product"
                message={`Are you sure you want to remove ${productToRemove?.name} from all categories?`}
                onCancel={() => {
                    setShowProductRemoveConfirm(false);
                    setProductToRemove(null);
                }}
                onConfirm={confirmRemoveProduct}
                confirmText="REMOVE PRODUCT"
                type="danger"
            />

            <BillsBreakdownModal
                show={showBillsModal}
                onClose={() => setShowBillsModal(false)}
                breakdown={dashboardStats.billsBreakdown}
                onDelete={handleDeleteBills}
            />
        </div>
    );
};

export default DashboardTab;
