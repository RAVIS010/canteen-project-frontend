import React, { useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

const DateRangeFilter = ({ calendarFilter, setCalendarFilter }) => {
    const [fromDate, setFromDate] = useState(
        calendarFilter?.type === 'range' && calendarFilter.start ? calendarFilter.start.toISOString().split('T')[0] :
            calendarFilter?.type === 'day' ? calendarFilter.date.toISOString().split('T')[0] : ''
    );
    const [toDate, setToDate] = useState(
        calendarFilter?.type === 'range' && calendarFilter.end ? calendarFilter.end.toISOString().split('T')[0] : ''
    );
    const [error, setError] = useState('');

    const handleApplyFilter = () => {
        if (!fromDate) {
            setError('Please select a "From" date');
            return;
        }

        const start = new Date(fromDate);
        const end = toDate ? new Date(toDate) : null;

        if (end && start > end) {
            setError('"From" date cannot be after "To" date');
            return;
        }

        setError('');
        if (end) {
            setCalendarFilter({ type: 'range', start, end });
        } else {
            setCalendarFilter({ type: 'day', date: start });
        }
    };

    return (
        <div className="date-range-card" style={{
            background: '#ffffff',
            padding: '30px',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={20} color="#1e293b" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Date Range Filter</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>From</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 18px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.9rem',
                            color: '#1e293b',
                            background: '#f8fafc',
                            outline: 'none',
                            fontWeight: 600
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>To (Optional)</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 18px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.9rem',
                            color: '#1e293b',
                            background: '#f8fafc',
                            outline: 'none',
                            fontWeight: 600
                        }}
                    />
                </div>

                {error && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0', fontWeight: 700 }}>{error}</p>
                )}

                <button
                    onClick={handleApplyFilter}
                    style={{
                        background: '#1a1a1a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '16px',
                        borderRadius: '14px',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'all 0.2s ease',
                        marginTop: '10px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    Apply Filter <ChevronRight size={18} />
                </button>

                {(fromDate || toDate) && (
                    <button
                        onClick={() => {
                            setFromDate('');
                            setToDate('');
                            setCalendarFilter(null);
                        }}
                        style={{
                            background: 'transparent',
                            color: '#64748b',
                            border: '1px solid #e2e8f0',
                            padding: '12px',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            marginTop: '-10px'
                        }}
                    >
                        Reset Filter
                    </button>
                )}
            </div>
        </div>
    );
};

export default DateRangeFilter;
