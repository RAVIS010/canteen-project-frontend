import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useMessBase } from './mess/useMessBase';
import { useMessProduction } from './mess/useMessProduction';
import { useMessTransfers } from './mess/useMessTransfers';
import { useMessReturns } from './mess/useMessReturns';
import { useMessReports } from './mess/useMessReports';

export const useMessDashboard = ({ adminProductionUnits = [], adminCanteens = [] }) => {
    const [activeTab, setActiveTab] = useState('production');
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const notificationRef = useRef(null);

    // Use a ref and a stable wrapper to break circular dependencies and fix initialization order
    const refreshRef = useRef();
    const stableRefresh = useCallback((unit) => {
        if (typeof refreshRef.current === 'function') {
            refreshRef.current(unit);
        }
    }, []);

    // 1. Base Hook
    const base = useMessBase({ adminProductionUnits, adminCanteens });
    const {
        globalProductionUnit, currentDate, userName, canteensList, formatLocation,
        fetchAdminProductData, masterCategories, masterProducts
    } = base;

    // 2. Returns Hook (Needed by Transfers)
    const returns = useMessReturns({
        globalProductionUnit,
        refreshDashboardData: stableRefresh
    });
    const { returnItems, setReturnItems } = returns;

    // 3. Production Hook
    const production = useMessProduction({
        globalProductionUnit,
        currentDate,
        userName,
        formatLocation,
        refreshDashboardData: stableRefresh
    });
    const { fetchProductionItems, fetchProductionRecords, productionRecords } = production;

    // 4. Transfers Hook
    const transfers = useMessTransfers({
        globalProductionUnit,
        userName,
        canteensList,
        fetchProductionItems,
        setLastSyncTime,
        setReturnItems
    });
    const { fetchTransfersData, fetchPendingTransfers, salesData, fetchSalesData } = transfers;

    // 5. Reports Hook
    const reports = useMessReports({
        productionRecords,
        salesData,
        returnItems,
        globalProductionUnit,
        formatLocation
    });

    const refreshDashboardData = useCallback(async (unitOverride) => {
        const targetUnit = unitOverride || globalProductionUnit;
        try {
            const [transfersFormatted] = await Promise.all([
                transfers.fetchTransfersData(),
                production.fetchProductionItems(targetUnit),
                production.fetchProductionRecords(),
                base.fetchAdminProductData(),
                transfers.fetchSalesData(),
            ]);
            if (transfersFormatted) setNotifications(transfersFormatted);
            setLastSyncTime(new Date());
        } catch (err) {
            console.error('[Dashboard] Refresh error:', err);
        }
    }, [globalProductionUnit, transfers.fetchTransfersData, production.fetchProductionItems, production.fetchProductionRecords, base.fetchAdminProductData, transfers.fetchSalesData]);

    // Keep the ref updated with the latest refresh logic
    useEffect(() => {
        refreshRef.current = refreshDashboardData;
    }, [refreshDashboardData]);

    useEffect(() => {
        refreshDashboardData(globalProductionUnit);
    }, [globalProductionUnit, refreshDashboardData]);

    useEffect(() => {
        if (activeTab === 'receive-items') {
            fetchPendingTransfers(globalProductionUnit);
        }
    }, [activeTab, globalProductionUnit, fetchPendingTransfers]);

    useEffect(() => {
        const interval = setInterval(() => {
            refreshDashboardData(globalProductionUnit);
        }, 15000);
        return () => clearInterval(interval);
    }, [refreshDashboardData, globalProductionUnit]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dynamicCategoryItems = useMemo(() => {
        const result = {};
        masterCategories.forEach(cat => {
            const upName = cat.name.toUpperCase();
            result[upName] = [];
        });
        masterProducts.forEach(p => {
            if (p.category) {
                const upCat = p.category.toUpperCase();
                const upName = p.name.toUpperCase();
                if (!result[upCat]) result[upCat] = [];
                if (!result[upCat].includes(upName)) result[upCat].push(upName);
            }
        });
        const finalResult = {};
        Object.keys(result).forEach(key => {
            if (result[key].length > 0) finalResult[key] = result[key].sort();
        });
        return finalResult;
    }, [masterCategories, masterProducts]);

    // Cleanup Logic for Tab switching
    useEffect(() => {
        const cats = Object.keys(dynamicCategoryItems);
        if (cats.length > 0) {
            // Only auto-initialize if completely empty
            if (!production.newItem.category) {
                production.setNewItem(prev => ({
                    ...prev,
                    category: cats[0],
                    name: dynamicCategoryItems[cats[0]][0] || ''
                }));
            }
            if (!transfers.transferItem.category) {
                transfers.setTransferItem(prev => ({
                    ...prev,
                    category: cats[0],
                    name: dynamicCategoryItems[cats[0]][0] || ''
                }));
            }
        }
    }, [dynamicCategoryItems]); // Reduce dependency array to avoid unnecessary resets

    return {
        ...base,
        ...production,
        ...transfers,
        ...returns,
        ...reports,
        activeTab, setActiveTab,
        notifications, showNotifications, setShowNotifications, notificationRef,
        dynamicCategoryItems,
        refreshDashboardData
    };
};
