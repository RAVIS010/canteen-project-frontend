import '../Admin.css';
import React from 'react';

const BillingTab = ({
    transfers,
    itemPrices,
    currentUser,
    handleSingleBill
}) => {
    const acceptedTransfers = transfers.filter(t => t.status === 'Accepted');

    return (
        <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>Billing System</h2>
            </div>
            <div className="billing-layout" style={{ gridTemplateColumns: '1fr' }}>
                <div className="billing-main">
                    <div className="billing-table-wrap">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Unit Price</th>
                                    <th>Quantity</th>
                                    <th>From / To</th>
                                    <th>Subtotal</th>
                                    <th>Billed By</th>
                                    <th>Bill</th>
                                </tr>
                            </thead>
                            <tbody>
                                {acceptedTransfers.length > 0 ? (
                                    acceptedTransfers.map((t) => {
                                        const price = itemPrices[t.item] || 0;
                                        return (
                                            <tr key={t._id}>
                                                <td className="font-bold">{t.item}</td>
                                                <td>₹{price}</td>
                                                <td>{t.quantity}</td>
                                                <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                                                    {t.from} → {t.to}
                                                </td>
                                                <td className="font-bold">₹{price * t.quantity}</td>
                                                <td
                                                    style={{
                                                        color: '#aaa',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {t.initiatedBy || currentUser || 'Authorized Staff'}
                                                </td>
                                                <td>
                                                    <button
                                                        className="primary-btn-sm"
                                                        style={{
                                                            padding: '5px 10px',
                                                            fontSize: '0.7rem',
                                                            background: '#00d2ff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            color: '#ffffff',
                                                            fontWeight: '900',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleSingleBill(t)}
                                                    >
                                                        VIEW BILL
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>No accepted items available for billing</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingTab;
