import React from 'react';
import { Download } from 'lucide-react';

const ReportsTab = ({
    reportSubTab,
    setReportSubTab,
    reportSearchItem,
    setReportSearchItem,
    timeFilter,
    setTimeFilter,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    handleDownloadExcel,
    handleDownloadPDF,
    getDailyReportData,
    getReturnReportData,
    getDemandReportData
}) => {
    return (
        <div className="content-card animate-fadeIn">
            <div className="card-header pb-4 border-b border-[#222]">
                <div>
                    <h2>Reports</h2>
                </div>
            </div>

            {/* Sub-tabs for Reports */}
            <div className="reports-nav">
                <button
                    className={`report-tab-btn ${reportSubTab === 'daily-production' ? 'active' : ''}`}
                    onClick={() => setReportSubTab('daily-production')}
                >
                    Daily Production vs Sales
                </button>
                <button
                    className={`report-tab-btn ${reportSubTab === 'wastage' ? 'active' : ''}`}
                    onClick={() => setReportSubTab('wastage')}
                >
                    Return Report
                </button>
                <button
                    className={`report-tab-btn ${reportSubTab === 'demand' ? 'active' : ''}`}
                    onClick={() => setReportSubTab('demand')}
                >
                    Sales Point Demand Report
                </button>
            </div>

            {/* Report Content based on Sub-tab */}
            {reportSubTab === 'daily-production' && (
                <div className="report-section animate-fadeIn">
                    <div className="reports-toolbar">
                        <h3>Production vs Sales Breakdown</h3>

                        <div className="toolbar-actions">
                            <div className="toolbar-filter flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span>Item:</span>
                                    <input
                                        type="text"
                                        placeholder="Search item..."
                                        value={reportSearchItem}
                                        onChange={(e) => setReportSearchItem(e.target.value)}
                                        className="w-[150px]"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Duration:</span>
                                    <select
                                        value={timeFilter}
                                        onChange={(e) => setTimeFilter(e.target.value)}
                                    >
                                        <option value="last-hour">Last Hour</option>
                                        <option value="1-day">1 Day</option>
                                        <option value="1-week">1 Week</option>
                                        <option value="1-month">1 Month</option>
                                        <option value="1-year">1 Year</option>
                                        <option value="custom-range">Custom Range</option>
                                    </select>
                                    {timeFilter === 'custom-range' && (
                                        <div className="flex items-center gap-2 ml-2 flex-wrap sm:flex-nowrap">
                                            <input
                                                type="date"
                                                className="w-[130px]"
                                                value={customStartDate}
                                                max={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setCustomStartDate(e.target.value)}
                                            />
                                            <span className="text-gray-400">to</span>
                                            <input
                                                type="date"
                                                className="w-[130px]"
                                                value={customEndDate}
                                                max={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setCustomEndDate(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="toolbar-divider"></div>

                            <div className="toolbar-buttons">
                                <button
                                    className="primary-btn-sm btn-excel flex items-center gap-2"
                                    onClick={handleDownloadExcel}
                                >
                                    <Download size={14} /> Excel
                                </button>
                                <button
                                    className="primary-btn-sm btn-pdf flex items-center gap-2"
                                    onClick={handleDownloadPDF}
                                >
                                    <Download size={14} /> PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="table-container mt-4">
                        <table className="custom-table text-sm">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Item</th>
                                    <th>Production Unit</th>
                                    <th>Total Produced</th>
                                    <th>C1</th>
                                    <th>C2</th>
                                    <th>C3</th>
                                    <th>C4</th>
                                    <th>Unsold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getDailyReportData().map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="text-gray-400">{item.date}</td>
                                        <td className="font-bold text-black">{item.item}</td>
                                        <td><span className="category-tag whitespace-nowrap inline-block">{item.productionUnit}</span></td>
                                        <td className="text-black font-bold">{item.produced}</td>
                                        <td>{item.sales.canteen1}</td>
                                        <td>{item.sales.canteen2}</td>
                                        <td>{item.sales.canteen3}</td>
                                        <td>{item.sales.canteen4}</td>
                                        <td className="text-red-500 font-bold">{item.unsold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {reportSubTab === 'wastage' && (
                <div className="report-section animate-fadeIn">
                    <div className="reports-toolbar">
                        <h3>Wastage & Returns Analytics</h3>

                        <div className="toolbar-actions">
                            <div className="toolbar-filter flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span>Item:</span>
                                    <input
                                        type="text"
                                        placeholder="Search item..."
                                        value={reportSearchItem}
                                        onChange={(e) => setReportSearchItem(e.target.value)}
                                        className="w-[150px]"
                                    />
                                </div>
                            </div>
                            <div className="toolbar-divider"></div>
                            <div className="toolbar-buttons">
                                <button className="primary-btn-sm btn-excel flex items-center gap-2" onClick={handleDownloadExcel}><Download size={14} /> Excel</button>
                                <button className="primary-btn-sm btn-pdf flex items-center gap-2" onClick={handleDownloadPDF}><Download size={14} /> PDF</button>
                            </div>
                        </div>
                    </div>

                    <div className="table-container mt-4">
                        <table className="custom-table text-sm">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Item</th>
                                    <th>Total Return</th>
                                    <th>C1</th>
                                    <th>C2</th>
                                    <th>C3</th>
                                    <th>C4</th>
                                    <th>Key Reason</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getReturnReportData().map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="text-gray-400">{row.date}</td>
                                        <td className="font-bold text-black">{row.item}</td>
                                        <td className="text-red-500 font-bold">{row.totalReturn}</td>
                                        <td>{row.breakdown.canteen1}</td>
                                        <td>{row.breakdown.canteen2}</td>
                                        <td>{row.breakdown.canteen3}</td>
                                        <td>{row.breakdown.canteen4}</td>
                                        <td><span className="category-tag whitespace-nowrap inline-block">{row.primaryReason}</span></td>
                                        <td>
                                            <span className={`status-badge ${row.status === 'Pending' ? 'waiting' : 'completed'}`}>
                                                {row.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {reportSubTab === 'demand' && (
                <div className="report-section animate-fadeIn">
                    <div className="reports-toolbar">
                        <h3>Sales Point Demand Analysis</h3>

                        <div className="toolbar-actions">
                            <div className="toolbar-filter flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span>Item:</span>
                                    <input
                                        type="text"
                                        placeholder="Search item..."
                                        value={reportSearchItem}
                                        onChange={(e) => setReportSearchItem(e.target.value)}
                                        className="w-[150px]"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Duration:</span>
                                    <select
                                        value={timeFilter}
                                        onChange={(e) => setTimeFilter(e.target.value)}
                                    >
                                        <option value="last-hour">Last Hour</option>
                                        <option value="1-day">1 Day</option>
                                        <option value="1-week">1 Week</option>
                                        <option value="1-month">1 Month</option>
                                        <option value="1-year">1 Year</option>
                                        <option value="custom-range">Custom Range</option>
                                    </select>
                                    {timeFilter === 'custom-range' && (
                                        <div className="flex items-center gap-2 ml-2 flex-wrap sm:flex-nowrap">
                                            <input
                                                type="date"
                                                className="w-[130px]"
                                                value={customStartDate}
                                                max={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setCustomStartDate(e.target.value)}
                                            />
                                            <span className="text-gray-400">to</span>
                                            <input
                                                type="date"
                                                className="w-[130px]"
                                                value={customEndDate}
                                                max={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setCustomEndDate(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="toolbar-divider"></div>

                            <div className="toolbar-buttons">
                                <button className="primary-btn-sm btn-excel flex items-center gap-2" onClick={handleDownloadExcel}><Download size={14} /> Excel</button>
                                <button className="primary-btn-sm btn-pdf flex items-center gap-2" onClick={handleDownloadPDF}><Download size={14} /> PDF</button>
                            </div>
                        </div>
                    </div>

                    <div className="table-container mt-6">
                        <table className="custom-table text-sm">
                            <thead>
                                <tr>
                                    <th>Sales Point</th>
                                    <th>Top Consumed Item</th>
                                    <th>Category</th>
                                    <th>Total Consumed</th>
                                    <th>Avg Daily Demand</th>
                                    <th>Demand Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getDemandReportData().map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="font-bold text-black">{row.canteen}</td>
                                        <td className="text-blue-400 font-bold">{row.topItem}</td>
                                        <td><span className="category-tag whitespace-nowrap inline-block">{row.category}</span></td>
                                        <td className="text-black font-bold">{row.totalConsumed} units</td>
                                        <td>{row.avgDaily} units/day</td>
                                        <td>
                                            <span className={`status-badge ${row.trend === 'Increasing' || row.trend === 'Very High' || row.trend === 'Decreasing' ? 'completed' :
                                                row.trend === 'Stable' ? 'waiting' : 'failed'
                                                }`}>
                                                {row.trend}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsTab;
