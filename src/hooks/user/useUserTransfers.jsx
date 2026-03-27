import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export const useUserTransfers = ({ userCanteen, assignedCanteens, items, fetchProducts, userName, normalizeCanteen }) => {
    const [transferForm, setTransferForm] = useState({
        itemId: '',
        quantity: '',
        from: userCanteen,
        to: '',
        total: ''
    });
    const [transferSearch, setTransferSearch] = useState('');
    const [fromSearch, setFromSearch] = useState(userCanteen);
    const [toSearch, setToSearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
    const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
    const [transferErrors, setTransferErrors] = useState({ item: false, quantity: false, from: false, to: false });
    const [showTransferSuccess, setShowTransferSuccess] = useState(false);
    const [transferSuccessMsg, setTransferSuccessMsg] = useState('');

    const [pendingTransfers, setPendingTransfers] = useState([]);
    const [transferHistory, setTransferHistory] = useState([]);
    const [acceptedMsg, setAcceptedMsg] = useState('');
    const [notifications, setNotifications] = useState([]);

    const fetchTransferHistory = useCallback(async () => {
        if (!userCanteen) return;
        try {
            const data = await api.get('/transfers');
            if (Array.isArray(data)) {
                const normalizedUserCanteen = normalizeCanteen(userCanteen);
                // History of transfers FROM this canteen (excluding returns which are handled separately)
                const history = data.filter(t => {
                    const normalizedFrom = normalizeCanteen(t.from);
                    return assignedCanteens.includes(normalizedFrom) && t.status !== 'Returned';
                });
                setTransferHistory(history);
            }
        } catch (err) {
            console.error('Failed to fetch transfer history:', err);
        }
    }, [userCanteen, normalizeCanteen, assignedCanteens]);

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await api.get('/transfers');
            if (Array.isArray(data)) {
                const relevantData = data.filter(t => {
                    if (!t.to) return false;
                    const normalizedTo = normalizeCanteen(t.to);
                    return assignedCanteens.includes(normalizedTo);
                });
                const formatted = relevantData.map(t => ({
                    id: t._id,
                    item: t.item || t.itemName,
                    from: t.from,
                    to: t.to,
                    qty: t.quantity,
                    status: t.status,
                    time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    date: new Date(t.createdAt).toLocaleDateString()
                }));
                setNotifications(formatted);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    }, [assignedCanteens, normalizeCanteen]);

    const handleTransferChange = (e) => {
        const { name, value } = e.target;
        setTransferForm(prev => {
            const updated = { ...prev, [name]: value };
            const item = items.find(i => i.id?.toString() === updated.itemId?.toString());

            if (item) {
                const qty = parseFloat(updated.quantity) || 0;
                updated.total = (item.price * qty).toString();
                if (!updated.from) {
                    updated.from = userCanteen;
                }
            } else {
                updated.total = '';
            }
            return updated;
        });
    };

    const handleSelectStockItem = (item) => {
        setTransferForm(prev => {
            const qty = parseFloat(prev.quantity) || 0;
            return {
                ...prev,
                itemId: item.id.toString(),
                total: (item.price * qty).toString()
            };
        });
        setTransferSearch(item.name);
        setIsDropdownOpen(false);
    };

    const handleSelectFromLocation = (loc) => {
        setTransferForm(prev => ({ ...prev, from: loc }));
        setFromSearch(loc);
        setIsFromDropdownOpen(false);
    };

    const handleSelectToLocation = (loc) => {
        setTransferForm(prev => ({ ...prev, to: loc }));
        setToSearch(loc);
        setIsToDropdownOpen(false);
    };

    const handleTransferSubmit = async () => {
        const { itemId, quantity, from, to } = transferForm;
        const qty = parseFloat(quantity);

        const errors = {
            item: !itemId,
            quantity: !quantity || qty <= 0,
            from: !from,
            to: !to
        };

        if (errors.item || errors.quantity || errors.from || errors.to) {
            setTransferErrors(errors);
            return;
        }

        setTransferErrors({ item: false, quantity: false, from: false, to: false });

        const item = items.find(i => i.id.toString() === itemId.toString());
        if (!item) return;

        if (qty > item.stock) {
            toast.error(`Insufficient stock. Only ${item.stock} available.`, { style: { background: '#fff', color: '#000' } });
            return;
        }

        try {
            await api.post('/transfers', {
                item: item.name,
                quantity: qty,
                from: from,
                to: to,
                category: item.category,
                status: 'Pending'
            });

            const formattedDest = normalizeCanteen(to);
            const formatLocationLabel = (loc) => {
                const normalized = normalizeCanteen(loc);
                return normalized.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            };

            const confirmMsg = (
                <div style={{ textAlign: 'center' }}>
                    {userName} successfully transferred {qty} {item.name}
                    from <span style={{ fontWeight: 800, color: '#000' }}>{formatLocationLabel(from)}</span>
                    to <span style={{ fontWeight: 800, color: '#ef4444' }}>{formatLocationLabel(formattedDest)}</span>.
                </div>
            );
            setTransferSuccessMsg(confirmMsg);
            setShowTransferSuccess(true);
            fetchProducts();
            fetchTransferHistory();

            setTransferForm({
                itemId: '',
                quantity: '',
                from: userCanteen,
                to: '',
                total: ''
            });
            setTransferSearch('');
            setFromSearch(userCanteen);
            setToSearch('');
            setTimeout(() => setShowTransferSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to save transfer:', err);
            toast.error(err.response?.data?.error || 'Server error. Failed to initiate transfer.');
        }
    };

    const handleAcceptTransfer = async (transfer) => {
        try {
            await api.patch(`/transfers/${transfer._id}/accept`);
            setPendingTransfers(prev => prev.map(t =>
                t._id === transfer._id ? { ...t, status: 'Accepted' } : t
            ));
            setAcceptedMsg(`✅ Load accepted from ${transfer.from}!`);
            setTimeout(() => setAcceptedMsg(''), 3000);
            await fetchProducts();
        } catch (err) {
            console.error('Accept failed:', err);
        }
    };

    return {
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
        notifications, setNotifications,
        transferHistory, setTransferHistory,
        fetchNotifications,
        fetchTransferHistory,
        handleTransferChange,
        handleSelectStockItem,
        handleSelectFromLocation,
        handleSelectToLocation,
        handleTransferSubmit,
        handleAcceptTransfer
    };
};
