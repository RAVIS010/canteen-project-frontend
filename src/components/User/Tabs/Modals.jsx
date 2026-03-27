import React, { useRef } from 'react';
import { X, Printer, CheckCircle2, CreditCard, Banknote, Gift, Split, UtensilsCrossed } from 'lucide-react';

export const ReceiptModal = ({ showReceipt, setShowReceipt, currentReceipt, handleFinalizeSale }) => {
    const printRef = useRef(null);

    // Filter out items with 0 price (complimentary) for cleaner display if needed, 
    // or just display as per data.
    if (!showReceipt || !currentReceipt) return null;

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
            <div className="modal-content receipt-modal animate-scaleUp" style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #eee' }}>
                <div ref={printRef} style={{ padding: '32px' }}>
                    <div className="receipt-print-area" style={{ fontFamily: "'Inter', sans-serif", color: '#000' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginBottom: '16px' }}>
                            <span>{currentReceipt.date}, {currentReceipt.time}</span>
                            <span>{currentReceipt.billNum}</span>
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                <UtensilsCrossed size={36} strokeWidth={1.5} />
                            </div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, letterSpacing: '-0.3px' }}>{currentReceipt.canteenName || 'CMS Canteen'}</h2>
                        </div>

                        <div style={{ borderTop: '1px dashed #eee', paddingTop: '20px', marginBottom: '20px' }}>
                            {currentReceipt.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
                                    <span style={{ fontWeight: '600' }}>{item.name.toUpperCase()} x{item.qty}</span>
                                    <span style={{ fontWeight: '700' }}>₹{Math.round(item.qty * item.price)}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid #000', paddingTop: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>TOTAL AMOUNT</span>
                            <span style={{ fontWeight: '800', fontSize: '1.4rem' }}>₹{Math.round(currentReceipt.total)}</span>
                        </div>

                        <div style={{ textAlign: 'center', color: '#999', fontSize: '11px', lineHeight: '1.5', marginBottom: '24px' }}>
                            This bill will work only within 2 hours. After that, it will not be valid.
                        </div>

                        <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                            BILLED BY: {currentReceipt.operatorName?.toUpperCase() || 'EZHIL'}
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '12px', color: '#333' }}>
                            {currentReceipt.paymentMode}
                        </div>
                    </div>
                </div>

                <div className="no-print" style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={handleFinalizeSale}
                        className="confirm-print-btn"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                    >
                        <Printer size={18} /> CONFIRM & PRINT
                    </button>
                    <button
                        onClick={() => setShowReceipt(false)}
                        style={{ padding: '14px', background: '#fff', color: '#666', border: '1px solid #eee', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export const BillingPopup = ({
    showBillingPopup,
    setShowBillingPopup,
    selectedItem,
    popupData,
    handlePopupChange,
    handlePopupSplitChange,
    handlePopupSubmit,
    handleFinalizeSale // Passing this in case it's needed
}) => {
    if (!showBillingPopup || !selectedItem) return null;

    const grandTotal = selectedItem.price * (parseInt(popupData.quantity) || 0);

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
            <div className="modal-content animate-scaleUp" style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
                <div style={{ padding: '24px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Item Checkout</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>{selectedItem.name}</p>
                    </div>
                    <button onClick={() => setShowBillingPopup(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '32px' }}>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px', display: 'block' }}>Quantity</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                name="quantity"
                                autoFocus
                                value={popupData.quantity}
                                onChange={handlePopupChange}
                                placeholder="0"
                                style={{ width: '100%', padding: '16px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
                            />
                            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}>
                                {selectedItem.stock} in stock
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '16px', display: 'block' }}>Payment Method</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                            <PaymentButton active={popupData.paymentMode === 'Cash'} onClick={() => handlePopupSplitChange('Cash')} icon={<Banknote size={18} />} label="Cash" />
                            <PaymentButton active={popupData.paymentMode === 'GPay'} onClick={() => handlePopupSplitChange('GPay')} icon={<CreditCard size={18} />} label="G-Pay" />
                            <PaymentButton active={popupData.paymentMode === 'Split'} onClick={() => handlePopupSplitChange('Split')} icon={<Split size={18} />} label="Split" />
                            <PaymentButton active={popupData.paymentMode === 'Complimentary'} onClick={() => handlePopupSplitChange('Complimentary')} icon={<Gift size={18} />} label="Free" />
                        </div>
                    </div>

                    {popupData.paymentMode === 'Split' && (
                        <div className="animate-slideDown" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '20px', background: '#f8fafc', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                            <div className="form-group">
                                <label style={{ color: '#64748b', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Cash Amount</label>
                                <input
                                    type="number"
                                    name="cashAmount"
                                    value={popupData.cashAmount}
                                    onChange={handlePopupChange}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700 }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ color: '#64748b', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>GPay Amount</label>
                                <input
                                    type="number"
                                    name="gpayAmount"
                                    value={popupData.gpayAmount}
                                    onChange={handlePopupChange}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700 }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ padding: '24px', background: '#0f172a', borderRadius: '16px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Total Amount</span>
                            <span style={{ fontSize: '1.75rem', fontWeight: 900 }}>₹{popupData.total || 0}</span>
                        </div>
                        <button
                            onClick={handlePopupSubmit}
                            disabled={!popupData.quantity || parseInt(popupData.quantity) <= 0}
                            style={{ padding: '12px 24px', background: !popupData.quantity || parseInt(popupData.quantity) <= 0 ? '#334155' : '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            CONFIRM BILL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PaymentButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            background: active ? '#eff6ff' : '#fff',
            border: `2px solid ${active ? '#3b82f6' : '#e2e8f0'}`,
            borderRadius: '12px',
            color: active ? '#1d4ed8' : '#64748b',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
        }}
    >
        {icon}
        {label}
    </button>
);
