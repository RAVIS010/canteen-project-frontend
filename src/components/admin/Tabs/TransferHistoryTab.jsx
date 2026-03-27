import '../Admin.css';
import React, { useState, useEffect } from 'react';
import { Search, Trash2, Calendar, ChevronRight } from 'lucide-react';
import DateRangeFilter from '../../DateRangeFilter';
import { formatLocation } from '../../../utils/adminUtils';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

const TransferHistoryTab = ({
    calendarFilter,
    setCalendarFilter,
}) => {
    const [transfers, setTransfers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTransfers();
    }, []);

    const fetchTransfers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/transfers');
            setTransfers(response);
        } catch (error) {
            console.error('Error fetching transfers:', error);
            toast.error('Failed to load transfer history');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (window.confirm('Are you sure you want to clear all transfer history? This action cannot be undone.')) {
            setIsLoading(true);
            try {
                await api.delete('/transfers/history/clear');
                toast.success('History cleared successfully');
                fetchTransfers();
            } catch (error) {
                console.error('Error clearing history:', error);
                toast.error('Failed to clear history');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDeleteTransfer = async (id) => {
        if (window.confirm('Delete this record?')) {
            try {
                await api.delete(`/transfers/${id}`);
                toast.success('Record deleted');
                fetchTransfers();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    const filteredTransfers = transfers.filter(t => {
        const tDate = new Date(t.createdAt);

        if (calendarFilter) {
            if (calendarFilter.type === 'day') {
                if (tDate.getDate() !== calendarFilter.date.getDate() ||
                    tDate.getMonth() !== calendarFilter.date.getMonth() ||
                    tDate.getFullYear() !== calendarFilter.date.getFullYear()) {
                    return false;
                }
            } else if (calendarFilter.type === 'range') {
                const startMs = new Date(calendarFilter.start.getFullYear(), calendarFilter.start.getMonth(), calendarFilter.start.getDate()).getTime();
                const endMs = new Date(calendarFilter.end.getFullYear(), calendarFilter.end.getMonth(), calendarFilter.end.getDate(), 23, 59, 59, 999).getTime();
                const currentMs = tDate.getTime();
                if (currentMs < startMs || currentMs > endMs) {
                    return false;
                }
            }
        }

        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;

        const formattedDate = tDate.toLocaleDateString('en-GB');
        return (
            formattedDate.includes(query) ||
            t.item.toLowerCase().includes(query) ||
            t.from.toLowerCase().includes(query) ||
            t.to.toLowerCase().includes(query)
        );
    });

    return (
        <div className="transfer-history-layout" style={{ display: 'flex', gap: '25px', padding: '20px' }}>
            {/* Main Content Area */}
            <div className="transfer-history-main" style={{ flex: 1, minWidth: 0 }}>
                <div className="table-container" style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    border: '1px solid #f1f5f9',
                    overflow: 'hidden'
                }}>
                    <div className="table-header" style={{
                        padding: '25px 30px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #f1f5f9'
                    }}>
                        <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Transfer History & Status
                        </h2>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <button
                                onClick={handleClearHistory}
                                style={{
                                    background: '#ff5c5c',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 18px',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 4px 10px rgba(255, 92, 92, 0.2)'
                                }}
                            >
                                Clear History
                            </button>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                {showSearch ? (
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            padding: '8px 12px 8px 35px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '0.85rem',
                                            width: '200px',
                                            outline: 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                        autoFocus
                                    />
                                ) : null}
                                <Search
                                    size={18}
                                    style={{
                                        cursor: 'pointer',
                                        color: '#64748b',
                                        marginLeft: showSearch ? '-190px' : '0',
                                        zIndex: 1
                                    }}
                                    onClick={() => setShowSearch(!showSearch)}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#ffffff' }}>
                                    <th style={{ padding: '20px 30px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Date</th>
                                    <th style={{ padding: '20px 30px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Item</th>
                                    <th style={{ padding: '20px 30px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Quantity</th>
                                    <th style={{ padding: '20px 30px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>From</th>
                                    <th style={{ padding: '20px 30px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>To</th>
                                    <th style={{ padding: '20px 30px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '20px 30px', textAlign: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransfers.length > 0 ? (
                                    filteredTransfers.map((t) => (
                                        <tr key={t._id} style={{ borderBottom: '1px solid #f8faff' }}>
                                            <td style={{ padding: '20px 30px', fontSize: '0.85rem', color: '#94a3b8' }}>
                                                {new Date(t.createdAt).toLocaleDateString('en-GB')}
                                            </td>
                                            <td style={{ padding: '20px 30px', fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>
                                                {t.item.toUpperCase()}
                                            </td>
                                            <td style={{ padding: '20px 30px', color: '#475569', fontWeight: 600 }}>{t.quantity}</td>
                                            <td style={{ padding: '20px 30px', color: '#475569', fontSize: '0.85rem' }}>{formatLocation(t.from)}</td>
                                            <td style={{ padding: '20px 30px', color: '#475569', fontSize: '0.85rem' }}>{formatLocation(t.to)}</td>
                                            <td style={{ padding: '20px 30px' }}>
                                                <span style={{
                                                    background: t.status === 'Accepted' || t.status === 'Completed' ? '#ecfdf5' : '#fff7ed',
                                                    color: t.status === 'Accepted' || t.status === 'Completed' ? '#10b981' : '#f97316',
                                                    fontWeight: 800,
                                                    padding: '6px 14px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.7rem',
                                                    display: 'inline-block',
                                                    border: `1px solid ${t.status === 'Accepted' || t.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(249, 115, 22, 0.1)'}`
                                                }}>
                                                    {t.status === 'Accepted' || t.status === 'Completed' ? 'COMPLETED' : t.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px 30px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleDeleteTransfer(t._id)}
                                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '0.9rem' }}>
                                            {isLoading ? 'Loading transfers...' : 'No transfer history found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Sidebar Filter */}
            <div className="transfer-history-side" style={{ width: '320px' }}>
                <DateRangeFilter calendarFilter={calendarFilter} setCalendarFilter={setCalendarFilter} />
            </div>
        </div>
    );
};

export default TransferHistoryTab;
