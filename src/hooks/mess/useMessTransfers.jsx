import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export const useMessTransfers = ({ globalProductionUnit, userName, canteensList, fetchProductionItems, setLastSyncTime, setReturnItems }) => {
    const [pendingTransfers, setPendingTransfers] = useState([]);
    const [transferSuccess, setTransferSuccess] = useState('');
    const [showTransferSuccess, setShowTransferSuccess] = useState(false);
    const [acceptedMsg, setAcceptedMsg] = useState('');

    const [transferItem, setTransferItem] = useState({
        category: '',
        name: '',
        qty: '',
        fromUnit: globalProductionUnit,
        salesPoint: canteensList[0] || 'S Block',
        confirmed: false
    });

    const [salesData, setSalesData] = useState([]);

    const fetchSalesData = useCallback(async () => {
        try {
            const data = await api.get('/sales');
            if (Array.isArray(data)) setSalesData(data);
        } catch (err) {
            console.error('Failed to fetch sales:', err);
        }
    }, []);

    const fetchTransfersData = useCallback(async () => {
        try {
            const data = await api.get('/transfers');
            if (Array.isArray(data)) {
                // Formatting for notifications
                const formatted = data
                    .filter(t => {
                        if (!t.to) return false;
                        // For the notification bell, we only care about loads TO our current unit
                        return t.to.toLowerCase() === globalProductionUnit.toLowerCase();
                    })
                    .map(t => ({
                        id: t._id,
                        item: t.item || t.itemName,
                        from: t.from,
                        to: t.to,
                        qty: t.quantity,
                        status: t.status,
                        time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        date: new Date(t.createdAt).toLocaleDateString()
                    }));

                const returns = data
                    .filter(t => t.status === 'Returned' || (t.status === 'Accepted' && (t.to.toLowerCase().includes('mess') || t.to.toLowerCase().includes('bakery') || t.to.toLowerCase().includes('tummy'))))
                    .map(t => ({
                        id: t._id,
                        date: new Date(t.createdAt).toLocaleDateString(),
                        item: t.item,
                        qty: t.quantity,
                        from: t.from,
                        to: t.to,
                        reason: t.reason || 'Return requested',
                        status: t.status === 'Returned' ? 'Pending' : 'Accepted'
                    }));

                setReturnItems(returns);
                return formatted;
            }
        } catch (err) {
            console.error('Failed to fetch transfer data:', err);
        }
        return [];
    }, [setReturnItems]);

    const fetchPendingTransfers = useCallback(async (unit) => {
        try {
            const targetUnit = unit || globalProductionUnit;
            const data = await api.get(`/transfers`);
            if (Array.isArray(data)) {
                const relevant = data.filter(t =>
                    t.to.toLowerCase() === targetUnit.toLowerCase() &&
                    t.from.toLowerCase() !== targetUnit.toLowerCase() &&
                    t.status === 'Pending' // Only show pending in receive tab
                );
                setPendingTransfers(relevant);
            }
        } catch (err) {
            console.error('Failed to fetch pending transfers:', err);
        }
    }, [globalProductionUnit]);

    const handleTransferItem = useCallback(async (e) => {
        e.preventDefault();
        if (!transferItem.confirmed) {
            toast.error("Please confirm the transfer information.");
            return;
        }
        if (!transferItem.name || !transferItem.qty) return;

        const transferQty = parseFloat(transferItem.qty);
        try {
            await api.post('/transfers', {
                item: transferItem.name,
                quantity: transferQty,
                from: globalProductionUnit,
                to: transferItem.salesPoint,
                category: transferItem.category,
                status: 'Pending'
            });

            const confirmMsg = (
                <div style={{ textAlign: 'center' }}>
                    {userName} successfully transferred {transferQty} {transferItem.name}
                    from <span style={{ fontWeight: 800, color: '#000' }}>{globalProductionUnit}</span>
                    to <span style={{ fontWeight: 800, color: '#ef4444' }}>{transferItem.salesPoint}</span>.
                </div>
            );
            setTransferSuccess(confirmMsg);
            setShowTransferSuccess(true);
            fetchProductionItems();

            setTransferItem({
                category: '',
                name: '',
                qty: '',
                fromUnit: globalProductionUnit,
                salesPoint: canteensList[0] || 'S Block',
                confirmed: false
            });
        } catch (err) {
            console.error('Failed to initiate transfer:', err);
            const serverMsg = err.response?.data?.error;
            const networkMsg = err.message || "Connection error. Could not reach server.";
            toast.error(serverMsg || `Network Error: ${networkMsg}`);
        }

        setTimeout(() => {
            setTransferSuccess('');
            setShowTransferSuccess(false);
        }, 4000);
    }, [transferItem, globalProductionUnit, userName, fetchProductionItems, canteensList]);

    const handleAcceptTransfer = useCallback(async (transfer) => {
        try {
            await api.patch(`/transfers/${transfer._id}/accept`);
            setPendingTransfers(prev => prev.map(t =>
                t._id === transfer._id ? { ...t, status: 'Accepted' } : t
            ));
            setAcceptedMsg(`✅ Load accepted from ${transfer.from}!`);
            setTimeout(() => setAcceptedMsg(''), 3000);

            fetchProductionItems(globalProductionUnit);
            fetchPendingTransfers(globalProductionUnit);
            setLastSyncTime(new Date());
        } catch (err) {
            console.error('Accept transfer failed:', err);
            toast.error(err.response?.data?.error || 'Connection error. Could not accept transfer.');
        }
    }, [globalProductionUnit, fetchProductionItems, fetchPendingTransfers, setLastSyncTime]);

    return {
        pendingTransfers, setPendingTransfers,
        transferSuccess, setTransferSuccess,
        showTransferSuccess, setShowTransferSuccess,
        acceptedMsg, setAcceptedMsg,
        transferItem, setTransferItem,
        salesData, setSalesData,
        fetchSalesData,
        fetchTransfersData,
        fetchPendingTransfers,
        handleTransferItem,
        handleAcceptTransfer
    };
};
