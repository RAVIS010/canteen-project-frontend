import React from 'react';
import { Plus, ArrowUpRight, Trash2, CheckCircle } from 'lucide-react';

const ReturnToCPSTab = ({
    returnForm,
    handleReturnChange,
    consolidatedReturnItems,
    productionUnits,
    handleAddToReturnList,
    returnList,
    handleRemoveReturnItem,
    handleProcessAllReturns,
    setReturnList,
    returnHistory,
    userCanteen
}) => {
    return (
        <div className="content-card animate-fadeIn" style={{ maxWidth: '100%' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '32px', color: '#0f172a', letterSpacing: '-0.5px' }}>Return to CPS</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

                {/* LEFT: Add Item Form */}
                <div style={{ background: '#ffffff', border: '1px solid #3b82f6', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1.5, color: '#475569', marginBottom: '20px' }}>Add Item to Return</div>
                    <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="form-group">
                            <label style={{ color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px', display: 'block' }}>Item</label>
                            <select
                                name="itemId"
                                value={returnForm.itemId}
                                onChange={handleReturnChange}
                                style={{ background: '#ffffff', border: '1px solid #3b82f6', color: '#0f172a', borderRadius: '8px', padding: '16px', width: '100%', fontSize: '15px' }}
                            >
                                <option value="">Select Item</option>
                                {consolidatedReturnItems.map(i => (
                                    <option key={`${i.name}-${i.price}`} value={`${i.name}-${i.price}`}>
                                        {i.name} (₹{i.price}) ({i.stock} available)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px', display: 'block' }}>Return Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={returnForm.quantity}
                                onChange={handleReturnChange}
                                placeholder="0"
                                style={{ background: '#ffffff', border: '1px solid #3b82f6', color: '#0f172a', borderRadius: '8px', padding: '16px', width: '100%', fontSize: '15px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px', display: 'block' }}>Reason for Return</label>
                            <select
                                name="reason"
                                value={returnForm.reason}
                                onChange={handleReturnChange}
                                style={{ background: '#ffffff', border: '1px solid #3b82f6', color: '#0f172a', borderRadius: '8px', padding: '16px', width: '100%', fontSize: '15px' }}
                            >
                                <option>UNSOLD</option>
                                <option>OVERSTOCK</option>
                                <option>QUALITY ISSUE</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px', display: 'block' }}>Production Unit</label>
                            <select
                                name="productionUnit"
                                value={returnForm.productionUnit}
                                onChange={handleReturnChange}
                                style={{ background: '#ffffff', border: '1px solid #3b82f6', color: '#0f172a', borderRadius: '8px', padding: '16px', width: '100%', fontSize: '15px' }}
                            >
                                {productionUnits.map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="primary-btn"
                            onClick={handleAddToReturnList}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#0f172a', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}
                        >
                            <Plus size={16} /> Add to Return List
                        </button>
                    </div>
                </div>

                {/* RIGHT: Return List */}
                <div style={{ background: '#ffffff', border: '1px solid #3b82f6', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1.5, color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Return List</span>
                        {returnList.length > 0 && (
                            <span style={{ background: '#0f172a', color: '#ffffff', borderRadius: '20px', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 900 }}>
                                {returnList.length} item{returnList.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {returnList.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                            <ArrowUpRight size={36} strokeWidth={1.5} style={{ color: '#94a3b8' }} />
                            <p style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600 }}>No items added yet</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Add items from the form on the left</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {returnList.map(r => (
                                    <div key={r.itemId} style={{
                                        background: '#f8fafc', border: '1px solid #3b82f6',
                                        borderRadius: '10px', padding: '12px 16px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{r.itemName}</span>
                                            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                                Qty: <strong style={{ color: '#0f172a' }}>{r.qty}</strong>
                                                &nbsp;·&nbsp;{r.reason}
                                                &nbsp;·&nbsp;{r.productionUnit}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveReturnItem(r.itemId)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>
                                <span>TOTAL ITEMS TO RETURN</span>
                                <span style={{ color: '#0f172a', fontSize: '1.2rem', fontWeight: 900 }}>
                                    {returnList.reduce((a, r) => a + r.qty, 0)} units
                                </span>
                            </div>

                            <button
                                className="primary-btn"
                                onClick={handleProcessAllReturns}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, background: '#0f172a', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
                            >
                                <CheckCircle size={16} /> Process All Returns
                            </button>
                            <button
                                onClick={() => setReturnList([])}
                                style={{ background: 'transparent', border: '1px solid #3b82f6', color: '#475569', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', marginTop: '4px' }}
                            >
                                Clear List
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Returns History */}
            <div className="table-container" style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px', color: '#0f172a' }}>Recently Processed Returns</h3>
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Item Name</th>
                            <th>Qty</th>
                            <th>Sent To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returnHistory.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No return records found for {userCanteen}.</td>
                            </tr>
                        ) : (
                            returnHistory.map(h => (
                                <tr key={h._id}>
                                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(h.createdAt).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 700 }}>{h.item}</td>
                                    <td>{h.quantity}</td>
                                    <td>
                                        {h.to ? h.to.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '-'}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${h.status === 'Accepted' ? 'completed' : 'pending'}`}>
                                            {h.status === 'Accepted' ? 'RECEIVED' : 'IN TRANSIT'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReturnToCPSTab;

