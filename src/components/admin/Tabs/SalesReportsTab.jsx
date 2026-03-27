import '../Admin.css';
import React from 'react';
import { Search, Trash2, PieChart as PieChartIcon } from 'lucide-react';
import DateRangeFilter from '../../DateRangeFilter';
import { formatLocation } from '../../../utils/adminUtils';
import excelIcon from '../../../assets/excel_icon.png';
import pdfIcon from '../../../assets/pdf_icon.png';

const SalesReportsTab = ({
    canteenSalesHistory = [],
    localProductCategories = [],
    reportFilterCategory = '',
    setReportFilterCategory,
    reportFilterProduct = '',
    setReportFilterProduct,
    itemSearchQuery = '',
    setItemSearchQuery,
    reportFilterLocation = '',
    setReportFilterLocation,
    reportFilterBiller = '',
    setReportFilterBiller,
    reportFilterFromDate = '',
    setReportFilterFromDate,
    reportFilterToDate = '',
    setReportFilterToDate,
    calendarFilter = 'all',
    setCalendarFilter,
    reportViewMode = 'table',
    setReportViewMode,
    handleExportSalesExcel,
    handleExportSalesPDF,
    handleDeleteSale,
    users = [],
    canteens = [],
    productionUnits = []
}) => {
    const filteredSalesHistory = canteenSalesHistory.filter(sale => {
        let saleCategory = sale.category;
        if (!saleCategory) {
            const foundCat = localProductCategories.find(c => c.items.some(i => (i.name || i) === sale.productName));
            saleCategory = foundCat ? foundCat.category : '-';
        }

        if (reportFilterCategory && saleCategory !== reportFilterCategory) return false;
        if (reportFilterProduct && sale.productName !== reportFilterProduct) return false;
        if (itemSearchQuery && !sale.productName.toLowerCase().includes(itemSearchQuery.toLowerCase())) return false;

        const displayLoc = formatLocation(sale.location);
        if (reportFilterLocation && displayLoc !== formatLocation(reportFilterLocation)) return false;
        if (reportFilterBiller && sale.operatorName !== reportFilterBiller) return false;

        const sDate = new Date(sale.createdAt);
        sDate.setHours(0, 0, 0, 0);

        // Date Inputs (From/To)
        if (reportFilterFromDate) {
            const fromDate = new Date(reportFilterFromDate);
            fromDate.setHours(0, 0, 0, 0);
            if (sDate < fromDate) return false;
        }

        if (reportFilterToDate) {
            const toDate = new Date(reportFilterToDate);
            toDate.setHours(0, 0, 0, 0);
            if (sDate > toDate) return false;
        }

        // Calendar Component Filters
        if (calendarFilter) {
            if (calendarFilter.type === 'day') {
                const legacyDate = new Date(sale.createdAt);
                if (legacyDate.getDate() !== calendarFilter.date.getDate() ||
                    legacyDate.getMonth() !== calendarFilter.date.getMonth() ||
                    legacyDate.getFullYear() !== calendarFilter.date.getFullYear()) {
                    return false;
                }
            } else if (calendarFilter.type === 'range') {
                const start = new Date(calendarFilter.start);
                start.setHours(0, 0, 0, 0);
                const end = new Date(calendarFilter.end);
                end.setHours(23, 59, 59, 999);
                if (sDate < start || sDate > end) return false;
            }
        }

        return true;
    });

    const consolidatedMap = filteredSalesHistory.reduce((acc, sale) => {
        const key = `${sale.productName}_${formatLocation(sale.location)}`;
        if (!acc[key]) {
            let category = sale.category;
            if (!category) {
                const foundCat = localProductCategories.find(c => c.items.some(i => (i.name || i) === sale.productName));
                category = foundCat ? foundCat.category : '-';
            }

            acc[key] = {
                productName: sale.productName,
                location: sale.location,
                category: category,
                totalQty: 0,
                totalValue: 0,
                lastPrice: sale.price
            };
        }
        acc[key].totalQty += sale.sold;
        acc[key].totalValue += (sale.sold * sale.price);
        return acc;
    }, {});

    const consolidatedSales = Object.values(consolidatedMap).sort((a, b) => b.totalValue - a.totalValue);

    return (
        <div className="sales-report-layout animate-fadeIn">
            <div className="sales-report-main" style={{ minWidth: 0 }}>
                <div className="table-container">
                    <div className="filter-row" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '15px',
                        marginBottom: '20px',
                        background: '#f8fafc',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div className="filter-group">
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Product Category</label>
                            <select
                                value={reportFilterCategory}
                                onChange={(e) => {
                                    setReportFilterCategory(e.target.value);
                                    setReportFilterProduct('');
                                }}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                            >
                                <option value="">All Categories</option>
                                {Array.from(new Set(localProductCategories.map(c => c.category.toUpperCase().replace(/\s+/g, ''))))
                                    .sort()
                                    .map(normCat => {
                                        const originalCat = localProductCategories.find(c => c.category.toUpperCase().replace(/\s+/g, '') === normCat).category;
                                        return (
                                            <option key={normCat} value={originalCat}>{originalCat}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>

                        <div className="filter-group">
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Product Name</label>
                            <select
                                value={reportFilterProduct}
                                onChange={(e) => setReportFilterProduct(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                            >
                                <option value="">All Products</option>
                                {(reportFilterCategory
                                    ? localProductCategories.find(c => c.category === reportFilterCategory)?.items.map(i => i.name || i)
                                    : Array.from(new Set(localProductCategories.flatMap(c => c.items.map(i => i.name || i))))
                                )?.sort().map(item => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>


                        <div className="filter-group">
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Biller Name</label>
                            <select
                                value={reportFilterBiller}
                                onChange={(e) => setReportFilterBiller(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                            >
                                <option value="">All Billers</option>
                                {Array.from(new Set([
                                    ...users
                                        .filter(u => u.role === 'User')
                                        .filter(u => !reportFilterLocation || (u.assignedCanteens && u.assignedCanteens.some(c => formatLocation(c) === reportFilterLocation)))
                                        .map(u => u.name || u.fullName),
                                    ...canteenSalesHistory
                                        .filter(s => !reportFilterLocation || formatLocation(s.location) === reportFilterLocation)
                                        .map(s => s.operatorName)
                                        .filter(Boolean)
                                ])).sort().map(biller => {
                                    const user = users.find(u => (u.name || u.fullName) === biller);
                                    let displayName = biller;
                                    if (user && user.assignedCanteens && user.assignedCanteens.length > 0) {
                                        const canteenStr = user.assignedCanteens.map(c => formatLocation(c)).join(', ');
                                        displayName = `${biller} (${canteenStr})`;
                                    }
                                    return (
                                        <option key={biller} value={biller}>{displayName}</option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Canteen Location</label>
                            <select
                                value={reportFilterLocation}
                                onChange={(e) => setReportFilterLocation(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                            >
                                <option value="">All Canteens</option>
                                {canteens.map(loc => (
                                    <option key={loc} value={loc}>{formatLocation(loc).toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>From Date</label>
                            <input
                                type="date"
                                value={reportFilterFromDate}
                                onChange={(e) => setReportFilterFromDate(e.target.value)}
                                style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                            />
                        </div>

                        <div className="filter-group">
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>To Date</label>
                            <input
                                type="date"
                                value={reportFilterToDate}
                                onChange={(e) => setReportFilterToDate(e.target.value)}
                                style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                            />
                        </div>
                    </div>

                    <div className="table-header" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                                    {reportViewMode === 'Log' ? 'TRANSACTION LOG' : 'ITEM SUMMARY'}
                                </h2>
                                <div style={{
                                    display: 'flex',
                                    background: '#f1f5f9',
                                    padding: '4px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <button
                                        onClick={() => setReportViewMode('Log')}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            border: 'none',
                                            cursor: 'pointer',
                                            background: reportViewMode === 'Log' ? '#fff' : 'transparent',
                                            color: reportViewMode === 'Log' ? '#7c3aed' : '#64748b',
                                            boxShadow: reportViewMode === 'Log' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Transaction Log
                                    </button>
                                    <button
                                        onClick={() => setReportViewMode('Summary')}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            border: 'none',
                                            cursor: 'pointer',
                                            background: reportViewMode === 'Summary' ? '#fff' : 'transparent',
                                            color: reportViewMode === 'Summary' ? '#7c3aed' : '#64748b',
                                            boxShadow: reportViewMode === 'Summary' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Item Summary
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div 
                                    onClick={() => handleExportSalesPDF(filteredSalesHistory, consolidatedSales, reportViewMode)}
                                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    title="Download PDF"
                                >
                                    <img src={pdfIcon} alt="Download PDF" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
                                </div>
                                <div 
                                    onClick={() => handleExportSalesExcel(filteredSalesHistory, consolidatedSales, reportViewMode)}
                                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    title="Download Excel"
                                >
                                    <img src={excelIcon} alt="Download Excel" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {reportViewMode === 'Log' ? (
                        <div className="table-responsive-wrapper">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>DATE & TIME</th>
                                    <th>CANTEEN NAME</th>
                                    <th>PRODUCT</th>
                                    <th>QTY</th>
                                    <th>UNIT PRICE</th>
                                    <th>TOTAL</th>
                                    <th>PAYMENT</th>
                                    <th>BILLER</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSalesHistory.length > 0 ? (
                                    filteredSalesHistory.map((sale, index) => (
                                        <tr key={index}>
                                            <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', fontWeight: 600 }}>
                                                {new Date(sale.createdAt).toLocaleDateString('en-GB')} <br />
                                                <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>{new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                            <td style={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', fontSize: '0.8rem' }}>{formatLocation(sale.location)}</td>
                                            <td style={{ fontWeight: 700, color: '#1e293b' }}>{sale.productName}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontWeight: 900, color: '#6366f1' }}>{sale.sold}</span>
                                            </td>
                                            <td style={{ color: '#64748b', fontWeight: 600 }}>₹{sale.price}</td>
                                            <td style={{ fontWeight: 900, color: '#10b981' }}>₹{sale.sold * sale.price}</td>
                                            <td>
                                                <span className={`badge-payment ${sale.paymentMode?.toLowerCase()}`} style={{ fontSize: '0.65rem', fontWeight: 900 }}>
                                                    {sale.paymentMode}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{sale.operatorName || '-'}</td>
                                            <td>
                                                <button
                                                    className="delete-icon-btn"
                                                    style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
                                                    onClick={() => handleDeleteSale(sale._id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
                                            <div style={{ marginBottom: '20px' }}>
                                                <Search size={48} style={{ opacity: 0.1, margin: '0 auto 15px' }} />
                                            </div>
                                            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>No sales transactions found</p>
                                            <p style={{ fontSize: '0.85rem', marginTop: '5px', opacity: 0.7 }}>Try adjusting your filters or date range.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        </div>
                    ) : (
                        <div className="table-responsive-wrapper">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>CATEGORY</th>
                                    <th>PRODUCT</th>
                                    <th>CANTEEN NAME</th>
                                    <th>TOTAL QTY</th>
                                    <th>AVG. PRICE</th>
                                    <th>TOTAL VALUE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consolidatedSales.length > 0 ? (
                                    consolidatedSales.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{item.category || '-'}</td>
                                            <td style={{ fontWeight: 700 }}>{item.productName}</td>
                                            <td style={{ fontWeight: 600 }}>{formatLocation(item.location)}</td>
                                            <td style={{ fontWeight: 800, color: '#7c3aed' }}>{item.totalQty}</td>
                                            <td>₹{item.lastPrice}</td>
                                            <td style={{ fontWeight: 800, color: '#16a34a' }}>₹{item.totalValue}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
                                            <div style={{ marginBottom: '20px' }}>
                                                <PieChartIcon size={48} style={{ opacity: 0.1, margin: '0 auto 15px' }} />
                                            </div>
                                            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>No summary data available</p>
                                            <p style={{ fontSize: '0.85rem', marginTop: '5px', opacity: 0.7 }}>No items match your current filter criteria.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            {consolidatedSales.length > 0 && (
                                <tfoot>
                                    <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                                        <td colSpan="3" style={{ textAlign: 'right' }}>GRAND TOTAL:</td>
                                        <td style={{ color: '#7c3aed' }}>{consolidatedSales.reduce((s, i) => s + i.totalQty, 0)}</td>
                                        <td></td>
                                        <td style={{ color: '#16a34a' }}>₹{consolidatedSales.reduce((s, i) => s + i.totalValue, 0)}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                        </div>
                    )}
                </div>
            </div>
            <div className="sales-report-side" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>Consolidated Revenue</span>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981', margin: '4px 0 0 0', fontFamily: 'monospace' }}>₹{filteredSalesHistory.reduce((acc, s) => acc + (s.sold * s.price), 0).toLocaleString()}</h2>
                </div>
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter by Item</label>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} color="#64748b" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search item (e.g. Samosa)"
                            className="dark-field"
                            style={{ paddingLeft: '45px', marginBottom: 0 }}
                            value={itemSearchQuery}
                            onChange={(e) => setItemSearchQuery(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <DateRangeFilter calendarFilter={calendarFilter} setCalendarFilter={setCalendarFilter} />
            </div>
        </div>
    );
};

export default SalesReportsTab;
