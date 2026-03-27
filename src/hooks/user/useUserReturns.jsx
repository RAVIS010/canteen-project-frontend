import { useState, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export const useUserReturns = ({ userCanteen, items, fetchProducts, productionUnits, normalizeCanteen, assignedCanteens }) => {
    const [returnForm, setReturnForm] = useState({
        itemId: '',
        quantity: '',
        reason: 'UNSOLD',
        productionUnit: 'S Block'
    });
    const [returnList, setReturnList] = useState([]);
    const [returnSuccessMsg, setReturnSuccessMsg] = useState('');
    const [showReturnSuccess, setShowReturnSuccess] = useState(false);
    const [returnHistory, setReturnHistory] = useState([]);

    const consolidatedReturnItems = useMemo(() => {
        const groups = {};
        items.filter(i => i.stock > 0).forEach(i => {
            const normalizedName = (i.name || '').trim().toUpperCase();
            const key = `${normalizedName}-${i.price}`;
            if (!groups[key]) {
                groups[key] = { ...i, name: normalizedName };
            } else {
                groups[key].stock += i.stock;
            }
        });
        return Object.values(groups);
    }, [items]);

    const fetchReturnHistory = useCallback(async () => {
        if (!userCanteen) return;
        try {
            const data = await api.get(`/transfers`);
            if (Array.isArray(data)) {
                const normalizedUserCanteen = normalizeCanteen(userCanteen);
                const history = data.filter(t => {
                    const normalizedFrom = normalizeCanteen(t.from);
                    return assignedCanteens.includes(normalizedFrom) &&
                        (t.status === 'Returned' || (t.status === 'Accepted' && t.reason));
                });
                setReturnHistory(history);
            }
        } catch (err) {
            console.error('Failed to fetch return history:', err);
        }
    }, [userCanteen, normalizeCanteen, assignedCanteens]);

    const handleReturnChange = (e) => {
        const { name, value } = e.target;
        setReturnForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddToReturnList = () => {
        const { itemId, quantity, reason, productionUnit } = returnForm;
        if (!itemId || !quantity) return;

        const qty = parseInt(quantity, 10);
        if (isNaN(qty) || qty <= 0) {
            toast.error('Please enter a valid quantity.', { style: { background: '#fff', color: '#000' } });
            return;
        }

        const lastDashIndex = itemId.lastIndexOf('-');
        const targetName = itemId.substring(0, lastDashIndex);
        const targetPrice = itemId.substring(lastDashIndex + 1);

        const totalStock = items
            .filter(i => (i.name || '').trim().toUpperCase() === targetName && i.price.toString() === targetPrice)
            .reduce((sum, i) => sum + i.stock, 0);

        if (totalStock === 0) return;

        const alreadyInList = returnList.find(r => r.itemName === targetName && r.price.toString() === targetPrice);
        const alreadyQty = alreadyInList ? alreadyInList.qty : 0;

        if (alreadyQty + qty > totalStock) {
            toast.error(`Insufficient stock. Only ${totalStock - alreadyQty} more available for "${targetName}".`, { style: { background: '#fff', color: '#000' } });
            return;
        }

        if (alreadyInList) {
            setReturnList(prev => prev.map(r =>
                (r.itemName === targetName && r.price.toString() === targetPrice)
                    ? { ...r, qty: r.qty + qty, reason }
                    : r
            ));
        } else {
            setReturnList(prev => [...prev, {
                itemId,
                itemName: targetName,
                price: parseFloat(targetPrice),
                qty,
                reason,
                productionUnit
            }]);
        }

        setReturnForm(prev => ({ ...prev, itemId: '', quantity: '' }));
    };

    const handleRemoveReturnItem = (itemId) => {
        setReturnList(prev => prev.filter(r => r.itemId !== itemId));
    };

    const handleProcessAllReturns = async () => {
        if (returnList.length === 0) return;

        try {
            for (const mergedItem of returnList) {
                let remainingToReturn = mergedItem.qty;

                const sourceItems = items
                    .filter(i => (i.name || '').trim().toUpperCase() === mergedItem.itemName && i.price === mergedItem.price && i.stock > 0)
                    .sort((a, b) => b.stock - a.stock);

                for (const source of sourceItems) {
                    if (remainingToReturn <= 0) break;

                    const returnFromThisSource = Math.min(remainingToReturn, source.stock);

                    await api.post('/transfers', {
                        itemName: mergedItem.itemName,
                        quantity: returnFromThisSource,
                        from: source.location.toLowerCase(),
                        to: mergedItem.productionUnit.toLowerCase(),
                        status: 'Returned',
                        reason: mergedItem.reason
                    });

                    remainingToReturn -= returnFromThisSource;
                }
            }

            await fetchProducts();

            setReturnSuccessMsg(`Successfully returned ${returnList.length} items to CPS.`);
            setShowReturnSuccess(true);
            setReturnList([]);
            setReturnForm({ itemId: '', quantity: '', reason: 'UNSOLD', productionUnit: productionUnits[0] || 'Yummy Tummy' });
            await fetchReturnHistory();
            setTimeout(() => setShowReturnSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to process returns:', err);
            toast.error("Connection error. Some returns might not have been recorded.");
        }
    };

    return {
        returnForm, setReturnForm,
        returnList, setReturnList,
        returnSuccessMsg, setReturnSuccessMsg,
        showReturnSuccess, setShowReturnSuccess,
        returnHistory, setReturnHistory,
        consolidatedReturnItems,
        fetchReturnHistory,
        handleReturnChange,
        handleAddToReturnList,
        handleRemoveReturnItem,
        handleProcessAllReturns
    };
};
