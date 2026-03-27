import '../Admin.css';
import React from 'react';
import { Coffee } from 'lucide-react';

const BillModal = ({ selectedBill, setShowBill, setSelectedBill, currentUser, itemPrices, handleExportExcel }) => {
    if (!selectedBill) return null;

    const isExpired = selectedBill.createdAt ? (new Date() - new Date(selectedBill.createdAt)) > (3 * 60 * 60 * 1000) : false;
    const expiryTime = selectedBill.createdAt ? new Date(new Date(selectedBill.createdAt).getTime() + (3 * 60 * 60 * 1000)) : null;

    return (
        <div className="modal-overlay" onClick={() => { setShowBill(false); setSelectedBill(null); }}>
            <div className="bill-modal" onClick={e => e.stopPropagation()}>
                <button className="close-modal" onClick={() => { setShowBill(false); setSelectedBill(null); }}>&times;</button>
                <div className="bill-receipt">
                    <div className="bill-header">
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                            <Coffee size={44} color="#000" />
                        </div>
                        <h2>CMS RECEIPT</h2>
                        <p>Canteen Management System</p>

                        <div style={{
                            margin: '15px 0',
                            padding: '15px',
                            background: isExpired ? '#fff5f5' : '#f8fbfc',
                            borderRadius: '8px',
                            border: `2px solid ${isExpired ? '#fc8181' : '#000'}`
                        }}>
                            <p style={{ fontSize: '1.4rem', color: isExpired ? '#e53e3e' : '#000', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
                                {isExpired ? '● EXPIRED (Check-in Required)' : '● VALID CMS RECEIPT'}
                            </p>
                            <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '10px' }}>
                                <p style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: '900', textAlign: 'center' }}>
                                    {(selectedBill.raisedBy || currentUser || 'Authorized Staff').toUpperCase()}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#475569', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
                                    AUTHORIZED BY
                                </p>
                            </div>
                            <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#475569', textAlign: 'center', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                                <p><b>ISSUE TIME:</b> {selectedBill.createdAt ? new Date(selectedBill.createdAt).toLocaleString() : new Date().toLocaleString()}</p>
                                {expiryTime && !isExpired && (
                                    <p style={{ color: '#c05621', marginTop: '6px', fontWeight: 'bold' }}>
                                        <b>EXPIRES AT:</b> {expiryTime.toLocaleTimeString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bill-body">
                        {selectedBill.items.map((item, index) => (
                            <div key={index} className="bill-item" style={{ color: '#ffffff' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{item.item}</span>
                                    <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>₹{itemPrices[item.item] || 0} x {item.quantity}</span>
                                </div>
                                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>₹{(itemPrices[item.item] || 0) * item.quantity}</span>
                            </div>
                        ))}
                        <div className="bill-divider"></div>
                        <div className="bill-total">
                            <span>GRAND TOTAL</span>
                            <span>₹{selectedBill.total}</span>
                        </div>
                    </div>
                    <div className="bill-footer">
                        <p style={{ fontStyle: 'italic', marginBottom: '10px' }}>
                            {isExpired ? "This receipt is no longer valid for collection." : "Please collect your items within 3 hours."}
                        </p>
                        <p>Thank you for your visit!</p>
                        <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Computer Generated Receipt
                        </div>
                    </div>
                    <div className="bill-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
                        <button
                            className="print-action-btn"
                            onClick={() => window.print()}
                            style={{ marginTop: 0 }}
                            disabled={isExpired}
                        >
                            {isExpired ? 'Cannot Print' : 'Print Receipt'}
                        </button>
                        <button className="export-btn" onClick={handleExportExcel} style={{
                            background: '#107c10',
                            color: 'white',
                            border: 'none',
                            padding: '12px',
                            fontWeight: '900',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            textTransform: 'uppercase'
                        }}>
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillModal;
