import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
    Search,
    Utensils,
    Coffee,
    Trash2,
    Plus,
    Minus,
    Zap,
    ShoppingBag,
    CreditCard,
    Banknote,
    Gift,
    FileText,
    Clock,
    UtensilsCrossed,
    Package
} from 'lucide-react';
import './BillingPOS.css';

const BillingPOS = ({ products = [], onCheckout, initialCart = [], onItemSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState(initialCart);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [splitDetails, setSplitDetails] = useState({ cash: '', gpay: '' });

    // Filter products based on search
    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            p.stock > 0
        );
    }, [products, searchQuery]);

    // Group items for display to avoid duplicates across canteens
    const groupedProducts = useMemo(() => {
        const groups = {};
        filteredProducts.forEach(p => {
            const normalizedName = (p.name || '').trim().toUpperCase();
            const key = `${normalizedName}-${p.price}`;
            if (!groups[key]) {
                groups[key] = { ...p, name: normalizedName }; // Use normalized name
            } else {
                groups[key].stock += p.stock;
            }
        });
        return Object.values(groups);
    }, [filteredProducts]);

    const addToCart = (product) => {
        if (product.stock <= 0) return;

        setCart(prevCart => {
            const normalizedProductName = (product.name || '').trim().toUpperCase();
            const existing = prevCart.find(item =>
                (item.name || '').trim().toUpperCase() === normalizedProductName &&
                item.price === product.price
            );

            // Calculate total stock available for this specific item name + price across all locations
            const totalStock = products
                .filter(p => (p.name || '').trim().toUpperCase() === normalizedProductName && p.price === product.price)
                .reduce((sum, p) => sum + p.stock, 0);

            if (existing) {
                if (existing.qty >= totalStock) {
                    toast.error(`Insufficient stock. Only ${totalStock} available across all locations.`, { style: { background: '#fff', color: '#000' } });
                    return prevCart;
                }
                return prevCart.map(item => ((item.name || '').trim().toUpperCase() === normalizedProductName && item.price === product.price)
                    ? { ...item, qty: item.qty + 1 }
                    : item
                );
            }
            return [...prevCart, { ...product, name: normalizedProductName, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prevCart => {
            const currentItem = prevCart.find(item => item.id === id);
            if (!currentItem) return prevCart;

            const normalizedItemName = (currentItem.name || '').trim().toUpperCase();

            // Total stock check for increment
            if (delta > 0) {
                const totalStock = products
                    .filter(p => (p.name || '').trim().toUpperCase() === normalizedItemName && p.price === currentItem.price)
                    .reduce((sum, p) => sum + p.stock, 0);

                if (currentItem.qty >= totalStock) {
                    toast.error(`Limit reached. Only ${totalStock} units available in total.`, { style: { background: '#fff', color: '#000' } });
                    return prevCart;
                }
            }

            return prevCart.map(item => {
                if (item.id === currentItem.id) {
                    const newQty = Math.max(1, item.qty + delta);
                    return { ...item, qty: newQty };
                }
                return item;
            });
        });
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const clearCart = () => setCart([]);

    const totalAmount = useMemo(() => {
        return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }, [cart]);

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        if (method === 'SPLIT') {
            setSplitDetails({ cash: totalAmount, gpay: 0 });
        } else {
            setSplitDetails({ cash: '', gpay: '' });
        }
    };

    const handleSplitChange = (field, value) => {
        const numValue = parseFloat(value) || 0;
        const otherField = field === 'cash' ? 'gpay' : 'cash';
        const otherValue = Math.max(0, totalAmount - numValue);

        setSplitDetails({
            [field]: value,
            [otherField]: otherValue
        });
    };

    // Total available unique items (ignoring search)
    const totalAvailableCount = useMemo(() => {
        const groups = {};
        products
            .filter(p => p.stock > 0)
            .forEach(p => {
                const normalizedName = (p.name || '').trim().toUpperCase();
                const key = `${normalizedName}-${p.price}`;
                if (!groups[key]) {
                    groups[key] = true;
                }
            });
        return Object.keys(groups).length;
    }, [products]);

    return (
        <div className="pos-container">
            {/* Left Section - Products */}
            <div className="pos-products-section">
                <div className="search-container">
                    <div className="search-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="available-items-pill">
                        <Package size={14} className="pill-icon" />
                        <span className="pill-val">{totalAvailableCount}</span>
                        <span className="pill-label">AVAILABLE</span>
                    </div>
                </div>

                <div className="products-grid custom-scrollbar">
                    {groupedProducts.map((product, index) => {
                        const normalizedName = (product.name || '').trim().toUpperCase();
                        const qtyInCart = cart.find(item =>
                            (item.name || '').trim().toUpperCase() === normalizedName &&
                            item.price === product.price
                        )?.qty || 0;

                        return (
                            <div
                                key={`${normalizedName}-${product.price}`}
                                className={`product-card ${(index === 0 && searchQuery === '') ? 'selected' : ''}`}
                                onClick={() => onItemSelect ? onItemSelect(product) : addToCart(product)}
                            >
                                <div className="card-top">
                                    <div className="food-icon-wrapper">
                                        <UtensilsCrossed size={20} />
                                    </div>
                                    <div className="price-badge">₹{product.price}</div>
                                </div>
                                <div className="product-info">
                                    <p className="product-name">{product.name}</p>
                                    <p className={`stock-text ${product.stock <= 10 ? 'low-stock-text' : ''}`}>
                                        {product.stock <= 10
                                            ? `Low Stock (${product.stock})`
                                            : `${product.stock} in stock`}
                                    </p>
                                </div>

                                <div className="card-actions-wrapper">
                                    {qtyInCart > 0 && (
                                        <div className="card-qty-pill animate-scaleIn">
                                            {qtyInCart}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {filteredProducts.length === 0 && (
                        <div className="no-results-msg">
                            <Search size={48} strokeWidth={1} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <span>No items found matching your search</span>
                            <p style={{ fontSize: '12px', fontWeight: 500, marginTop: '8px', opacity: 0.6 }}>Try a different keyword or check inventory</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Section - Cart */}
            <div className="pos-cart-section">
                <div className="cart-header">
                    <div className="cart-title">
                        <ShoppingBag size={20} />
                        Order Cart
                    </div>
                    <div className="items-badge">{cart.length} items</div>
                </div>

                <div className="cart-items-container custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="empty-cart-state">
                            <ShoppingBag size={64} strokeWidth={1} style={{ opacity: 0.1, marginBottom: '8px' }} />
                            <p>YOUR CART IS EMPTY</p>
                            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Select items to start billing</span>
                        </div>
                    ) : cart.map(item => (
                        <div key={item.id} className="cart-item-row">
                            <div className="item-main">
                                <span className="item-row-name">{item.name}</span>
                                <span className="item-row-calc">₹{item.price} x {item.qty} = ₹{item.price * item.qty}</span>
                            </div>
                            <div className="item-controls">
                                <div className="qty-control">
                                    <button className="control-btn" onClick={(e) => { e.stopPropagation(); updateQty(item.id, -1); }}>
                                        <Minus size={14} strokeWidth={3} />
                                    </button>
                                    <span className="qty-number">{item.qty}</span>
                                    <button className="control-btn" onClick={(e) => { e.stopPropagation(); updateQty(item.id, 1); }}>
                                        <Plus size={14} strokeWidth={3} />
                                    </button>
                                </div>
                                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}>
                                    <Trash2 size={16} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="payment-section">
                    <span className="section-label">Payment Method</span>
                    <div className="payment-options">
                        <div
                            className={`pay-opt ${paymentMethod === 'CASH' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('CASH')}
                        >
                            <Banknote className="pay-icon" size={18} />
                            <span>CASH</span>
                        </div>
                        <div
                            className={`pay-opt ${paymentMethod === 'GPAY' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('GPAY')}
                        >
                            <CreditCard className="pay-icon" size={18} />
                            <span>GPAY</span>
                        </div>
                        <div
                            className={`pay-opt ${paymentMethod === 'COMPLIMENTARY' ? 'active' : ''}`}
                            onClick={() => handlePaymentMethodChange('COMPLIMENTARY')}
                        >
                            <Gift className="pay-icon" size={18} />
                            <span>FREE</span>
                        </div>
                        <div
                            className={`pay-opt ${paymentMethod === 'SPLIT' ? 'active' : ''}`}
                            onClick={() => handlePaymentMethodChange('SPLIT')}
                        >
                            <Zap className="pay-icon" size={18} />
                            <span>SPLIT</span>
                        </div>
                    </div>

                    {paymentMethod === 'SPLIT' && (
                        <div className="split-inputs animate-fadeIn">
                            <div className="split-field">
                                <label>CASH</label>
                                <div className="input-with-symbol">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        value={splitDetails.cash}
                                        onChange={(e) => handleSplitChange('cash', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="split-field">
                                <label>GPAY</label>
                                <div className="input-with-symbol">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        value={splitDetails.gpay}
                                        onChange={(e) => handleSplitChange('gpay', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bottom-area">
                    <div className="total-row">
                        <span className="total-label">Total</span>
                        <span className="total-amount">{paymentMethod === 'COMPLIMENTARY' ? 'FREE' : `₹${totalAmount}`}</span>
                    </div>

                    <button
                        className="generate-btn"
                        onClick={() => onCheckout && onCheckout(cart, paymentMethod, splitDetails)}
                        disabled={cart.length === 0 || (paymentMethod === 'SPLIT' && (parseFloat(splitDetails.cash || 0) + parseFloat(splitDetails.gpay || 0)) !== totalAmount)}
                    >
                        <FileText size={20} />
                        GENERATE BILL
                    </button>

                    <button className="clear-btn" onClick={clearCart}>
                        Clear Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingPOS;
