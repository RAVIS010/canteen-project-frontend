import React from 'react';
import {
    TrendingUp,
    Trash2,
    Receipt,
    Tag,
    X,
    FileSpreadsheet,
    Download,
    Banknote,
    Package,
    Zap,
    Search
} from 'lucide-react';

const UserReportsTab = ({
    reportSearchTerm,
    setReportSearchTerm,
    reportEntries,
    reportDuration,
    setReportDuration,
    paymentStats,
    selectedMetric,
    setSelectedMetric,
    handleDownloadPDF,
    handleDownloadExcel,
    userCanteen,
    availableItemsCount = 0
}) => {
    const filteredReportEntries = reportEntries.filter(entry =>
        entry.name.toLowerCase().includes(reportSearchTerm.toLowerCase())
    );
    const grandTotal = filteredReportEntries.reduce((acc, entry) => acc + (entry.sold * entry.price), 0);
    const totalItems = filteredReportEntries.reduce((acc, entry) => acc + entry.sold, 0);

    return (
        <div className="reports-center animate-fadeIn">
            <div className="reports-layout-wrapper">

                {/* Title */}
                <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '32px', color: '#0f172a', letterSpacing: '-0.5px' }}>Reports</h2>

                {/* Toolbar / Search & Duration */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="reports-toolbar-left" style={{ display: 'flex', gap: '16px', flex: 1 }}>
                        <div className="search-box-premium" style={{ flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 16px' }}>
                            <Search size={18} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Search by item name..."
                                value={reportSearchTerm}
                                onChange={(e) => setReportSearchTerm(e.target.value)}
                                style={{ border: 'none', padding: '14px', width: '100%', fontSize: '0.95rem', fontWeight: 500, outline: 'none' }}
                            />
                        </div>
                        <select
                            value={reportDuration}
                            onChange={(e) => setReportDuration(e.target.value)}
                            style={{ padding: '0 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#0f172a', outline: 'none', background: '#fff' }}
                        >
                            <option>Today</option>
                            <option>Last 1 Hour</option>
                            <option>Last 24 Hours</option>
                        </select>
                    </div>
                </div>

                {/* Main Summary Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div className="summary-card-premium">
                            <div className="sc-top">
                                <div className="sc-icon-box">
                                    <Banknote size={20} />
                                </div>
                                <div className="sc-pill-value text-green-400">
                                    ₹{grandTotal}
                                </div>
                            </div>
                            <div className="sc-bottom">
                                <span className="sc-label">GRAND TOTAL</span>
                            </div>
                        </div>

                        <div className="summary-card-premium">
                            <div className="sc-top">
                                <div className="sc-icon-box">
                                    <Package size={20} />
                                </div>
                                <div className="sc-pill-value">
                                    {totalItems}
                                </div>
                            </div>
                            <div className="sc-bottom">
                                <span className="sc-label">TOTAL ITEMS</span>
                                <span className="sc-subtext">Units Sold</span>
                            </div>
                        </div>

                        {/* Payment Option / Breakdown */}
                        <div className="summary-card-premium" style={{ minWidth: '280px' }}>
                            <div className="sc-top">
                                <div className="sc-icon-box" style={{ background: '#f1f5f9' }}>
                                    <Zap size={20} color="#8b5cf6" />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div className="payment-mini-pill">
                                        <span className="pm-label">CASH</span>
                                        <span className="pm-val">{paymentStats.cash}</span>
                                    </div>
                                    <div className="payment-mini-pill">
                                        <span className="pm-label">GPAY</span>
                                        <span className="pm-val">{paymentStats.gpay}</span>
                                    </div>
                                    <div className="payment-mini-pill">
                                        <span className="pm-label">FREE</span>
                                        <span className="pm-val">{paymentStats.complimentary}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="sc-bottom">
                                <span className="sc-label">PAYMENT BREAKDOWN</span>
                                <span className="sc-subtext">Transaction Counts by Type</span>
                            </div>
                        </div>

                        {/* 2x2 Interactive Metrics Grid */}
                        <div className="metrics-grid-2x2">
                            <div
                                className={`metric-mini-card ${selectedMetric === 'sold' ? 'active' : ''}`}
                                onClick={() => setSelectedMetric(selectedMetric === 'sold' ? null : 'sold')}
                            >
                                <div className="mmc-icon"><TrendingUp size={14} /></div>
                                <div className="mmc-content">
                                    <span className="mmc-val">{totalItems}</span>
                                    <span className="mmc-label">SOLD</span>
                                </div>
                            </div>
                            <div
                                className={`metric-mini-card ${selectedMetric === 'unsold' ? 'active' : ''}`}
                                onClick={() => setSelectedMetric(selectedMetric === 'unsold' ? null : 'unsold')}
                            >
                                <div className="mmc-icon"><Package size={14} /></div>
                                <div className="mmc-content">
                                    <span className="mmc-val">{availableItemsCount}</span>
                                    <span className="mmc-label">AVAILABLE</span>
                                </div>
                            </div>
                            <div
                                className={`metric-mini-card ${selectedMetric === 'bills' ? 'active' : ''}`}
                                onClick={() => setSelectedMetric(selectedMetric === 'bills' ? null : 'bills')}
                            >
                                <div className="mmc-icon"><Receipt size={14} /></div>
                                <div className="mmc-content">
                                    <span className="mmc-val">{filteredReportEntries.length}</span>
                                    <span className="mmc-label">TOTAL BILLS</span>
                                </div>
                            </div>
                            <div
                                className={`metric-mini-card ${selectedMetric === 'price' ? 'active' : ''}`}
                                onClick={() => setSelectedMetric(selectedMetric === 'price' ? null : 'price')}
                            >
                                <div className="mmc-icon"><Tag size={14} /></div>
                                <div className="mmc-content">
                                    <span className="mmc-val">₹{filteredReportEntries.length > 0 ? (filteredReportEntries.reduce((acc, entry) => acc + entry.price, 0) / filteredReportEntries.length).toFixed(0) : 0}</span>
                                    <span className="mmc-label">ITEM PRICE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Metric Detail Panel */}
                {selectedMetric && (
                    <div className="metric-detail-panel animate-slideDown">
                        <div className="detail-header">
                            <div className="detail-title-group">
                                <div className="detail-icon-bg">
                                    {selectedMetric === 'sold' && <TrendingUp size={20} />}
                                    {selectedMetric === 'unsold' && <Package size={20} />}
                                    {selectedMetric === 'bills' && <Receipt size={20} />}
                                    {selectedMetric === 'price' && <Tag size={20} />}
                                </div>
                                <h4 className="detail-title">
                                    {selectedMetric === 'sold' && 'Top Selling Items'}
                                    {selectedMetric === 'unsold' && 'Available Items Overview'}
                                    {selectedMetric === 'bills' && 'Transaction Volume Analysis'}
                                    {selectedMetric === 'price' && 'Price Distribution'}
                                </h4>
                            </div>
                            <button className="close-detail" onClick={() => setSelectedMetric(null)}><X size={20} /></button>
                        </div>
                        <div className="detail-content custom-scrollbar">
                            {selectedMetric === 'sold' && (
                                <div className="detail-stats-grid">
                                    {[...filteredReportEntries]
                                        .sort((a, b) => b.sold - a.sold)
                                        .slice(0, 5)
                                        .map((item, idx) => (
                                            <div key={idx} className="detail-item-stat">
                                                <div className="dis-label">
                                                    <span className="item-name">{item.name}</span>
                                                    <span className="item-val">{item.sold} sold</span>
                                                </div>
                                                <div className="stat-bar-bg"><div className="stat-bar-fill" style={{ width: `${(item.sold / (totalItems || 1)) * 100}%` }}></div></div>
                                            </div>
                                        ))
                                    }
                                    {filteredReportEntries.length === 0 && <p className="no-data">No sales data available</p>}
                                </div>
                            )}
                            {selectedMetric === 'unsold' && (
                                <div className="detail-stats-grid">
                                    {[...filteredReportEntries]
                                        .filter(item => (item.unsold || 0) > 0)
                                        .sort((a, b) => (b.unsold || 0) - (a.unsold || 0))
                                        .slice(0, 5)
                                        .map((item, idx) => (
                                            <div key={idx} className="detail-item-stat">
                                                <div className="dis-label">
                                                    <span className="item-name">{item.name}</span>
                                                    <span className="item-val text-red-500">{item.unsold} unsold</span>
                                                </div>
                                                <div className="stat-bar-bg"><div className="stat-bar-fill bg-red-500" style={{ width: `${((item.unsold || 0) / (item.sold + (item.unsold || 0) || 1)) * 100}%` }}></div></div>
                                            </div>
                                        ))
                                    }
                                    {filteredReportEntries.filter(item => (item.unsold || 0) > 0).length === 0 && <p className="no-data">No return data available</p>}
                                </div>
                            )}
                            {selectedMetric === 'bills' && (
                                <div className="detail-info-row">
                                    <div className="info-stat">
                                        <span className="info-label">Current Period Bills</span>
                                        <span className="info-val">{filteredReportEntries.length}</span>
                                    </div>
                                    <div className="info-stat">
                                        <span className="info-label">Avg. Items Per Bill</span>
                                        <span className="info-val">{(totalItems / (filteredReportEntries.length || 1)).toFixed(1)}</span>
                                    </div>
                                    <div className="info-stat">
                                        <span className="info-label">Avg. Bill Value</span>
                                        <span className="info-val">₹{(grandTotal / (filteredReportEntries.length || 1)).toFixed(0)}</span>
                                    </div>
                                </div>
                            )}
                            {selectedMetric === 'price' && (
                                <div className="detail-info-row">
                                    <div className="info-stat">
                                        <span className="info-label">Highest Item Price</span>
                                        <span className="info-val">₹{Math.max(...filteredReportEntries.map(e => e.price), 0)}</span>
                                    </div>
                                    <div className="info-stat">
                                        <span className="info-label">Lowest Item Price</span>
                                        <span className="info-val">₹{Math.min(...filteredReportEntries.map(e => e.price), Infinity) === Infinity ? 0 : Math.min(...filteredReportEntries.map(e => e.price))}</span>
                                    </div>
                                    <div className="info-stat">
                                        <span className="info-label">Avg. Unit Price</span>
                                        <span className="info-val">₹{(filteredReportEntries.reduce((acc, entry) => acc + entry.price, 0) / (filteredReportEntries.length || 1)).toFixed(0)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Download Action Row — VERY VISIBLE */}
                <div className="export-actions-card">
                    <div className="export-text-group">
                        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '0.9rem', color: '#0f172a' }}>REPORT EXPORT OPTIONS</h4>
                    </div>
                    <div className="export-buttons-group">
                        <button
                            onClick={() => handleDownloadPDF(filteredReportEntries, userCanteen, reportDuration)}
                            className="download-btn-pdf"
                            title="Download PDF"
                        >
                            <FileSpreadsheet size={22} />
                        </button>
                        <button
                            onClick={() => handleDownloadExcel(filteredReportEntries, userCanteen, reportDuration)}
                            className="download-btn-excel"
                            title="Download Excel"
                        >
                            <Download size={22} />
                        </button>
                    </div>
                </div>
            </div>


            <div className="table-container no-scrollbar overflow-x-auto mt-8">
                <table className="custom-table w-full">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Item Name</th>
                            <th>Sold</th>
                            <th>Unsold</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReportEntries.map((entry, idx) => (
                            <tr key={idx}>
                                <td className="font-mono text-gray-400">{entry.date}</td>
                                <td className="text-gray-400">{entry.time}</td>
                                <td className="font-bold text-black">{entry.name}</td>
                                <td className="text-green-600 font-bold">{entry.sold}</td>
                                <td className="text-red-500 font-bold">{entry.unsold}</td>
                                <td className="text-gray-600">₹{entry.price}</td>
                                <td className="text-black font-black">₹{entry.sold * entry.price}</td>
                                <td>
                                    <span className={`payment-pill ${(entry.paymentMode || 'Cash').toLowerCase()}`}>
                                        {entry.paymentMode || 'Cash'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredReportEntries.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-20 text-gray-600 font-bold">
                                    No report data found for this period.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserReportsTab;
