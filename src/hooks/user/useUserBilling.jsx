import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export const useUserBilling = ({ userCanteen, assignedCanteens }) => {
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(true);
    const [cartPaymentMode, setCartPaymentMode] = useState('Cash');
    const [showBillingPopup, setShowBillingPopup] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [popupData, setPopupData] = useState({
        quantity: '',
        total: '',
        paymentMode: 'Cash'
    });
    const [showReceipt, setShowReceipt] = useState(false);
    const [currentReceipt, setCurrentReceipt] = useState(null);
    const [billCounter, setBillCounter] = useState(1);
    const [pendingSale, setPendingSale] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            setItemsLoading(true);
            const locParam = (assignedCanteens && assignedCanteens.length > 0) ? assignedCanteens.join(',') : userCanteen;
            const data = await api.get(`/products?location=${encodeURIComponent(locParam)}`);
            if (Array.isArray(data)) {
                setItems(data
                    .filter(p => (p.name || '').toUpperCase() !== 'PARUPPU VADAI')
                    .map(p => ({
                        id: p._id,
                        name: p.name,
                        price: p.price,
                        stock: p.stock,
                        category: p.category,
                        location: p.location
                    })));
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setItemsLoading(false);
        }
    }, [assignedCanteens, userCanteen]);

    const handlePopupChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const mode = value;
            let newTotal = selectedItem.price * popupData.quantity;
            if (mode === 'Complimentary') newTotal = 0;

            setPopupData({
                ...popupData,
                paymentMode: mode,
                total: newTotal
            });
            return;
        }

        const updatedData = { ...popupData, [name]: value };
        if (name === 'quantity') {
            if (value === '') {
                updatedData.quantity = '';
                updatedData.total = '';
            } else {
                const qty = Math.max(0, parseInt(value) || 0);
                updatedData.quantity = qty;
                const grandTotal = selectedItem.price * qty;
                updatedData.total = popupData.paymentMode === 'Complimentary' ? 0 : grandTotal;

                if (popupData.paymentMode === 'Split') {
                    updatedData.cashAmount = grandTotal;
                    updatedData.gpayAmount = 0;
                }
            }
        } else if (name === 'cashAmount' || name === 'gpayAmount') {
            const numValue = parseFloat(value) || 0;
            const grandTotal = selectedItem.price * (parseInt(popupData.quantity) || 0);
            const otherField = name === 'cashAmount' ? 'gpayAmount' : 'cashAmount';
            const otherValue = Math.max(0, grandTotal - numValue);
            updatedData[name] = value;
            updatedData[otherField] = otherValue;
        }
        setPopupData(updatedData);
    };

    const handlePopupSplitChange = (mode) => {
        let newTotal = selectedItem.price * (parseInt(popupData.quantity) || 0);
        if (mode === 'Complimentary') newTotal = 0;

        setPopupData({
            ...popupData,
            paymentMode: mode,
            total: newTotal,
            cashAmount: mode === 'Split' ? newTotal : '',
            gpayAmount: mode === 'Split' ? 0 : ''
        });
    };

    const handlePopupSubmit = async () => {
        const qty = parseInt(popupData.quantity) || 0;
        if (qty <= 0) return;

        if (qty > selectedItem.stock) {
            toast.error(`Insufficient stock. Only ${selectedItem.stock} items available.`, { style: { background: '#fff', color: '#000' } });
            return;
        }

        const operatorName = localStorage.getItem('name') || 'Operator';
        const now = new Date();
        const receipt = {
            billNum: `Bill No-${billCounter}`,
            canteenName: 'CMS Canteen',
            items: [{ name: selectedItem.name, qty: qty, price: popupData.paymentMode === 'Complimentary' ? 0 : selectedItem.price }],
            total: popupData.total || 0,
            paymentMode: popupData.paymentMode,
            splitDetails: popupData.paymentMode === 'Split' ? { cash: popupData.cashAmount, gpay: popupData.gpayAmount } : null,
            operatorName: operatorName,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString()
        };

        setPendingSale({
            type: 'single',
            productName: selectedItem.name,
            sold: qty,
            price: selectedItem.price,
            paymentMode: popupData.paymentMode,
            cashAmount: popupData.paymentMode === 'Split' ? popupData.cashAmount : (popupData.paymentMode === 'Cash' ? popupData.total : 0),
            gpayAmount: popupData.paymentMode === 'Split' ? popupData.gpayAmount : (popupData.paymentMode === 'GPay' ? popupData.total : 0),
            location: selectedItem.location
        });

        setBillCounter(prev => prev + 1);
        setCurrentReceipt(receipt);
        setShowReceipt(true);
        setShowBillingPopup(false);
    };

    const handleCheckout = useCallback((cartItems, paymentMethod, splitDetails) => {
        if (!cartItems || cartItems.length === 0) return;

        const operatorName = localStorage.getItem('name') || 'Operator';
        const now = new Date();
        const total = cartItems.reduce((sum, item) =>
            sum + (paymentMethod === 'COMPLIMENTARY' ? 0 : (item.price * item.qty)), 0
        );

        const receipt = {
            billNum: `Bill No-${billCounter}`,
            canteenName: userCanteen || 'CMS Canteen',
            items: cartItems.map(item => ({
                name: item.name,
                qty: item.qty,
                price: paymentMethod === 'COMPLIMENTARY' ? 0 : item.price
            })),
            total: total,
            paymentMode: paymentMethod,
            splitDetails: paymentMethod === 'SPLIT' ? splitDetails : null,
            operatorName: operatorName,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString()
        };

        setPendingSale({
            type: 'bulk',
            items: cartItems.map(item => ({
                ...item,
                price: paymentMethod === 'COMPLIMENTARY' ? 0 : item.price
            })),
            paymentMode: paymentMethod,
            cashAmount: paymentMethod === 'SPLIT' ? splitDetails.cash : (paymentMethod === 'CASH' ? total : 0),
            gpayAmount: paymentMethod === 'SPLIT' ? splitDetails.gpay : (paymentMethod === 'GPAY' ? total : 0),
            location: userCanteen
        });

        setBillCounter(prev => prev + 1);
        setCurrentReceipt(receipt);
        setShowReceipt(true);
        setCart([]); // Clear internal cart after checkout
    }, [billCounter, userCanteen, setCart]);

    const handleFinalizeSale = async () => {
        console.log('[useUserBilling] handleFinalizeSale called. pendingSale:', pendingSale);
        if (!pendingSale) {
            console.log('[useUserBilling] No pending sale, triggering window.print().');
            window.print();
            setShowReceipt(false);
            setCurrentReceipt(null);
            return;
        }

        try {
            console.log('[useUserBilling] Processing sale type:', pendingSale.type);
            if (pendingSale.type === 'single') {
                setItems(prevItems => prevItems.map(item =>
                    item.name === pendingSale.productName ? { ...item, stock: item.stock - pendingSale.sold } : item
                ));
            } else if (pendingSale.type === 'bulk') {
                setItems(prevItems => prevItems.map(item => {
                    const cartEntry = pendingSale.items.find(c => c.id === item.id || c.id === item._id);
                    return cartEntry ? { ...item, stock: item.stock - cartEntry.qty } : item;
                }));
            }

            const operatorName = localStorage.getItem('name') || 'Operator';

            if (pendingSale.type === 'single') {
                await api.post('/sales', {
                    productName: pendingSale.productName,
                    sold: pendingSale.sold,
                    price: pendingSale.price,
                    paymentMode: pendingSale.paymentMode,
                    cashAmount: pendingSale.cashAmount || 0,
                    gpayAmount: pendingSale.gpayAmount || 0,
                    location: pendingSale.location,
                    sessionId: localStorage.getItem('sessionId'),
                    operatorName: operatorName
                });
            } else {
                const bulkData = {
                    items: pendingSale.items.map(item => ({
                        productName: item.name,
                        sold: item.qty,
                        price: item.price,
                        id: item.id || item._id,
                        location: item.location
                    })),
                    paymentMode: pendingSale.paymentMode,
                    cashAmount: pendingSale.cashAmount || 0,
                    gpayAmount: pendingSale.gpayAmount || 0,
                    location: userCanteen,
                    sessionId: localStorage.getItem('sessionId'),
                    operatorName: operatorName
                };
                console.log('[useUserBilling] Sending bulk sale data:', bulkData);
                await api.post('/sales/bulk', bulkData);
            }

            console.log('[useUserBilling] Sale recorded successfully. Finalizing UX...');
            await fetchProducts();
            setPendingSale(null); // Clear pending so we don't save twice

            // Give a tiny delay for state to settle before printing
            setTimeout(async () => {
                window.print();
                // Automatically close receipt
                setShowReceipt(false);
                setCurrentReceipt(null);
                setSearchTerm(''); // Clear search for the next item

                // Force a hard refresh to ensure everything (including child components) 
                // is completely reset for the next customer.
                window.location.reload();
            }, 100);

        } catch (err) {
            console.error('[useUserBilling] Finalize sale failed:', err);
            toast.error('Failed to save sale records. Please try again.', { style: { background: '#fff', color: '#000' } });
        }
    };

    return {
        cart, setCart,
        searchTerm, setSearchTerm,
        items, setItems,
        itemsLoading, setItemsLoading,
        cartPaymentMode, setCartPaymentMode,
        showBillingPopup, setShowBillingPopup,
        selectedItem, setSelectedItem,
        popupData, setPopupData,
        showReceipt, setShowReceipt,
        currentReceipt, setCurrentReceipt,
        billCounter, setBillCounter,
        pendingSale, setPendingSale,
        fetchProducts,
        handleCheckout,
        handlePopupChange,
        handlePopupSplitChange,
        handlePopupSubmit,
        handleFinalizeSale
    };
};
