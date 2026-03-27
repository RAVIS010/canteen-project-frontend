import { useEffect, useCallback } from 'react';
import { useUserBase } from './user/useUserBase';
import { useUserBilling } from './user/useUserBilling';
import { useUserTransfers } from './user/useUserTransfers';
import { useUserReturns } from './user/useUserReturns';
import { useUserReports } from './user/useUserReports';
import api from '../api/axios';

export const useUserDashboard = ({ isEmbedded = false, adminCanteen = null, externalTab = null, adminCanteens = [], adminProductionUnits = [] }) => {
    // 1. Base Hook (Core State & Navigation)
    const base = useUserBase({ externalTab, adminCanteen, adminCanteens, adminProductionUnits });
    const {
        activeTab, setActiveTab, userName, userCanteen, assignedCanteens,
        locations, productionUnits, normalizeCanteen, handleLogout
    } = base;

    // 2. Billing Hook (POS & Items)
    const billing = useUserBilling({ userCanteen, assignedCanteens });
    const { items, fetchProducts } = billing;

    // 3. Transfers Hook (Transfers & Notifications)
    const transfers = useUserTransfers({
        userCanteen, assignedCanteens, items, fetchProducts, userName, normalizeCanteen
    });
    const { fetchNotifications, setPendingTransfers, fetchTransferHistory } = transfers;

    // 4. Returns Hook (Returns & Return History)
    const returns = useUserReturns({
        userCanteen, items, fetchProducts, productionUnits, normalizeCanteen, assignedCanteens
    });
    const { fetchReturnHistory } = returns;

    // 5. Reports Hook (Reporting & Stats)
    const reports = useUserReports({ userCanteen, assignedCanteens });
    const { fetchReports } = reports;

    // Orchestration and Polling
    useEffect(() => {
        if (activeTab === 'billing' || activeTab === 'transfer') {
            fetchProducts();
            if (activeTab === 'transfer') fetchTransferHistory();
        }
        if (activeTab === 'receive') {
            if (assignedCanteens && assignedCanteens.length > 0) {
                api.get('/transfers')
                    .then(data => {
                        if (Array.isArray(data)) {
                            const relevant = data.filter(t =>
                                t.to &&
                                t.from &&
                                assignedCanteens.includes(normalizeCanteen(t.to)) &&
                                !assignedCanteens.includes(normalizeCanteen(t.from)) &&
                                ['Pending', 'Returned', 'Accepted'].includes(t.status)
                            );
                            setPendingTransfers(relevant);
                        }
                    })
                    .catch(err => console.error('Failed to fetch transfers:', err));
            }
        }
        if (activeTab === 'return') {
            fetchReturnHistory();
        }
    }, [activeTab, fetchProducts, fetchReturnHistory, assignedCanteens, normalizeCanteen, setPendingTransfers]);

    useEffect(() => {
        if (activeTab === 'reports') {
            fetchReports();
            const interval = setInterval(fetchReports, 60000);
            return () => clearInterval(interval);
        }
    }, [activeTab, fetchReports]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Combined API for backward compatibility
    return {
        ...base,
        ...billing,
        ...transfers,
        ...returns,
        ...reports
    };
};
