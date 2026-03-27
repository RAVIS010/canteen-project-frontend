import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export const useMessProduction = ({ globalProductionUnit, currentDate, userName, refreshDashboardData, formatLocation }) => {
    const [productionItems, setProductionItems] = useState([]);
    const [productionRecords, setProductionRecords] = useState([]);
    const [addItemSuccess, setAddItemSuccess] = useState('');
    const [showAddSuccess, setShowAddSuccess] = useState(false);

    const [newItem, setNewItem] = useState({
        category: '',
        name: '',
        qty: '',
        price: '',
        confirmed: false
    });

    const fetchProductionRecords = useCallback(async () => {
        try {
            const data = await api.get('/production');
            if (Array.isArray(data)) setProductionRecords(data);
        } catch (err) {
            console.error('Failed to fetch production records:', err);
        }
    }, [setProductionRecords]);

    const fetchProductionItems = useCallback(async (unit) => {
        try {
            const targetUnit = unit || globalProductionUnit;
            const url = `/products?location=${encodeURIComponent(targetUnit)}`;
            const data = await api.get(url);
            if (Array.isArray(data)) {
                const targetFormatted = formatLocation(targetUnit);
                const filtered = data
                    .filter(p => {
                        const productLocFormatted = formatLocation(p.location || 'Central mess');
                        return productLocFormatted === targetFormatted;
                    })
                    .map(p => ({ ...p, qty: p.stock }));
                setProductionItems(filtered);
            }
        } catch (err) {
            console.error('Failed to fetch inventory:', err);
        }
    }, [globalProductionUnit, formatLocation]);

    const handleAddItem = useCallback(async (e) => {
        e.preventDefault();
        if (!newItem.confirmed) {
            toast.error("Please confirm to add the item to the production list.");
            return;
        }
        if (!newItem.name || !newItem.qty || !newItem.price) return;

        const qty = parseFloat(newItem.qty);
        const price = parseFloat(newItem.price);
        const total = qty * price;

        try {
            await Promise.all([
                api.post('/production', {
                    date: currentDate,
                    category: newItem.category,
                    name: newItem.name,
                    qty: qty,
                    price: price,
                    total: total,
                    productionUnit: globalProductionUnit,
                    location: globalProductionUnit
                }),
                api.post('/products', {
                    name: newItem.name,
                    category: newItem.category,
                    price: price,
                    stock: qty,
                    location: globalProductionUnit
                })
            ]);

            setAddItemSuccess(`${userName} successfully added ${newItem.name} to production`);
            setShowAddSuccess(true);
            refreshDashboardData(globalProductionUnit);
            setNewItem({
                category: '',
                name: '',
                qty: '',
                price: '',
                confirmed: false
            });
        } catch (err) {
            console.error('Error syncing production item:', err);
            toast.error(err.response?.data?.error || 'Failed to sync with backend');
        }

        setTimeout(() => {
            setAddItemSuccess('');
            setShowAddSuccess(false);
        }, 3000);
    }, [newItem, currentDate, globalProductionUnit, userName, refreshDashboardData]);

    const handleDeleteProduction = async (id, itemName, qty) => {
        if (!window.confirm(`Are you sure you want to permanently delete "${itemName}" from this unit's inventory? This will remove the item card and all its remaining stock (${qty || 0}).`)) {
            return;
        }

        try {
            await api.delete(`/products/${id}`);
            toast.success(`${itemName} removed from inventory`);
            refreshDashboardData(globalProductionUnit);
        } catch (err) {
            console.error('Error deleting product:', err);
            toast.error(err.response?.data?.error || "Connection error. Could not delete item.");
        }
    };

    return {
        productionItems, setProductionItems,
        productionRecords, setProductionRecords,
        addItemSuccess, setAddItemSuccess,
        showAddSuccess, setShowAddSuccess,
        newItem, setNewItem,
        fetchProductionRecords,
        fetchProductionItems,
        handleAddItem,
        handleDeleteProduction
    };
};
