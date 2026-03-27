import React from 'react';

const TransferItemsTab = ({
    items,
    transferSearch,
    setTransferSearch,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    handleSelectStockItem,
    transferForm,
    handleTransferChange,
    setTransferErrors,
    fromSearch,
    toSearch,
    setToSearch,
    isToDropdownOpen,
    setIsToDropdownOpen,
    toDropdownRef,
    locations,
    handleSelectToLocation,
    handleTransferSubmit,
    transferHistory = [],
    userCanteen
}) => {
    const filteredStocks = items.filter(i =>
        i.name.toLowerCase().includes(transferSearch.toLowerCase()) &&
        i.stock > 0
    );

    return (
        <div className="content-card animate-fadeIn" style={{ maxWidth: '850px', margin: '40px auto', background: 'transparent', border: 'none', padding: 0 }}>
            {/* Same form as before... */}
            <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '40px', color: '#0f172a', letterSpacing: '-0.5px' }}>STOCK TRANSFER</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', marginBottom: '32px' }}>
                {/* [Form content remains unchanged] */}
                {/* SELECT STOCK */}
                <div className="form-group">
                    <label style={{ color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px', display: 'block' }}>SELECT STOCK</label>
                    <div className="searchable-select" style={{ border: 'none' }} ref={dropdownRef}>
                        <input
                            type="text"
                            placeholder="Search product..."
                            value={transferSearch}
                            style={{ background: '#ffffff', border: '1px solid #2563eb', color: '#0f172a', borderRadius: '8px', padding: '16px', width: '100%', fontSize: '15px' }}
                            onChange={(e) => {
                                setTransferSearch(e.target.value);
                                setIsDropdownOpen(true);
                                setTransferErrors(prev => ({ ...prev, item: false }));
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                        />
                        {isDropdownOpen && (
                            <div className="dropdown-results custom-scrollbar" style={{ background: '#ffffff', border: '1px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                {filteredStocks.length > 0 ? (
                                    filteredStocks.map(i => (
                                        <div
                                            key={i.id}
                                            className="result-item"
                                            onClick={() => handleSelectStockItem(i)}
                                            style={{ borderBottom: '1px solid #e2e8f0' }}
                                        >
                                            <div className="ri-content">
                                                <span className="ri-name" style={{ color: '#0f172a' }}>{i.name}</span>
                                                <span className="ri-stock" style={{ color: i.stock <= 10 ? '#ef4444' : '#64748b', fontWeight: i.stock <= 10 ? 700 : 400 }}>
                                                    {i.stock <= 10 ? `LOW STOCK (${i.stock})` : `${i.stock} in stock`}
                                                </span>
                                            </div>
                                            <span className="ri-price" style={{ color: '#0f172a' }}>₹{i.price}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-results" style={{ color: '#64748b' }}>No items found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* QUANTITY */}
                <div className="form-group">
                    <label style={{ color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px', display: 'block' }}>QUANTITY</label>
                    <input
                        type="number"
                        name="quantity"
                        placeholder="0"
                        value={transferForm.quantity}
                        style={{ background: '#ffffff', border: '1px solid #2563eb', color: '#0f172a', borderRadius: '8px', padding: '16px', width: '100%', fontSize: '15px' }}
                        onChange={(e) => {
                            handleTransferChange(e);
                            setTransferErrors(prev => ({ ...prev, quantity: false }));
                        }}
                    />
                </div>

                {/* TRANSFER FROM */}
                <div className="form-group">
                    <label style={{ color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px', display: 'block' }}>TRANSFER FROM</label>
                    <input
                        type="text"
                        placeholder="Search source..."
                        value={fromSearch}
                        style={{ background: '#f1f5f9', border: '1px solid #2563eb', color: '#64748b', borderRadius: '8px', padding: '16px', width: '100%', fontSize: '15px', cursor: 'not-allowed' }}
                        readOnly={true}
                    />
                </div>

                {/* TRANSFER TO */}
                <div className="form-group">
                    <label style={{ color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px', display: 'block' }}>TRANSFER TO</label>
                    <div className="searchable-select" style={{ border: 'none' }} ref={toDropdownRef}>
                        <input
                            type="text"
                            placeholder="Search destination..."
                            value={toSearch}
                            style={{ background: '#ffffff', border: '1px solid #2563eb', color: '#0f172a', borderRadius: '8px', padding: '16px', width: '100%', fontSize: '15px' }}
                            onChange={(e) => {
                                setToSearch(e.target.value);
                                setIsToDropdownOpen(true);
                                setTransferForm(prev => ({ ...prev, to: e.target.value }));
                                setTransferErrors(prev => ({ ...prev, to: false }));
                            }}
                            onFocus={() => setIsToDropdownOpen(true)}
                        />
                        {isToDropdownOpen && (
                            <div className="dropdown-results custom-scrollbar" style={{ background: '#ffffff', border: '1px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                {locations.filter(loc =>
                                    loc.toLowerCase().includes(toSearch.toLowerCase()) &&
                                    loc.toLowerCase() !== (transferForm.from || '').toLowerCase()
                                ).map((loc, idx) => (
                                    <div key={idx} className="result-item" onClick={() => handleSelectToLocation(loc)} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <span className="ri-name" style={{ color: '#0f172a' }}>{loc}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* TOTAL */}
            <div className="form-group" style={{ marginBottom: '40px', maxWidth: '300px' }}>
                <label style={{ color: '#475569', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px', display: 'block' }}>TOTAL (₹)</label>
                <input
                    type="text"
                    value={transferForm.total || 0}
                    readOnly={true}
                    style={{ background: '#f8fafc', border: '1px solid #2563eb', color: '#0f172a', borderRadius: '8px', padding: '16px', width: '100%', fontSize: '18px', fontWeight: 900 }}
                />
            </div>

            {transferForm.itemId && parseFloat(transferForm.quantity) > 0 && transferForm.from && transferForm.to ? (
                <button
                    className="primary-btn"
                    style={{ width: '100%', padding: '20px', borderRadius: '8px', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', background: '#0f172a', color: '#ffffff', cursor: 'pointer', marginBottom: '40px' }}
                    onClick={handleTransferSubmit}
                >
                    INITIATE TRANSFER
                </button>
            ) : (
                <div style={{ textAlign: 'center', padding: '16px', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '40px' }}>
                    Fill all fields to enable transfer
                </div>
            )}

            {/* Recent Transfers History */}
            <div className="table-container" style={{ marginTop: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px', color: '#0f172a' }}>Recent Transfers History</h3>
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
                        {transferHistory.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No transfer records found for {userCanteen}.</td>
                            </tr>
                        ) : (
                            transferHistory.map(h => (
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

export default TransferItemsTab;

