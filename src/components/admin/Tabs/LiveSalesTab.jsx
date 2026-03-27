import '../Admin.css';
import React from 'react';

const LiveSalesTab = ({
    transfers = [],
    canteens = [],
    productionUnits = [],
    allProducts = []
}) => {
    // Current date normalized to midnight for accurate day filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Map product names to prices for revenue calculation
    const priceMap = allProducts.reduce((acc, p) => {
        acc[p.name.toUpperCase()] = p.price || 0;
        return acc;
    }, {});

    // Filter today's completed/accepted transfers
    const todayTransfers = transfers.filter(t => {
        const tDate = new Date(t.createdAt);
        tDate.setHours(0, 0, 0, 0);
        return tDate.getTime() === today.getTime() && (t.status === 'COMPLETED' || t.status === 'Accepted' || t.status === 'ACCEPTED');
    });

    // Combine all unique active locations (Canteens + Production Units)
    const activeLocations = Array.from(new Set([
        ...canteens,
        ...productionUnits.map(u => u.name)
    ])).filter(Boolean);

    const canteenColors = ['#8b5cf6', '#22c55e', '#f97316', '#a855f7', '#ec4899', '#facc15', '#06b6d4', '#475569'];

    // Calculate metrics per location
    const locationMetrics = activeLocations.map((name, i) => {
        const normalizedName = name.toUpperCase();
        const locationTransfers = todayTransfers.filter(t =>
            t.to?.toUpperCase() === normalizedName || t.from?.toUpperCase() === normalizedName
        );

        const itemsMoved = new Set(locationTransfers.map(t => t.item)).size;
        const totalQty = locationTransfers.reduce((sum, t) => sum + (t.quantity || 0), 0);
        const revenue = locationTransfers.reduce((sum, t) => {
            const price = priceMap[t.item?.toUpperCase()] || 0;
            return sum + (price * (t.quantity || 0));
        }, 0);

        return {
            name: normalizedName,
            itemsMoved,
            qty: totalQty,
            revenue,
            color: canteenColors[i % canteenColors.length],
            status: totalQty > 0 ? 'ACTIVE' : 'NO DATA'
        };
    });

    const maxRevenue = Math.max(10, ...locationMetrics.map(m => m.revenue));

    return (
        <div className="reports-container animate-fadeIn">
            <div className="table-container" style={{ background: '#ffffff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                {/* Header section with pulse animation */}
                <div className="table-header" style={{ marginBottom: '30px' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>
                        <span style={{
                            display: 'inline-block',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#22c55e',
                            boxShadow: '0 0 10px #22c55e',
                            animation: 'pulse 1.5s infinite'
                        }}></span>
                        <span style={{ color: '#22c55e', fontSize: '0.75rem', letterSpacing: '0.5px' }}>LIVE UPDATING</span>
                        <span style={{ color: '#cbd5e1' }}>—</span>
                        SALES PER CANTEEN
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                        Updated in real-time from accepted transfers
                    </p>
                </div>

                {/* Reduced size Bar Chart section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '25px',
                    height: '140px', // Reduced height as requested
                    padding: '0 10px 10px',
                    borderBottom: '1.5px solid #0f172a',
                    marginBottom: '35px',
                    overflowX: 'auto'
                }}>
                    {locationMetrics.map((m, i) => {
                        const barHeight = Math.max(5, (m.revenue / maxRevenue) * 100);
                        return (
                            <div key={i} style={{ flex: 1, minWidth: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: m.color, marginBottom: '6px' }}>₹{m.revenue.toLocaleString()}</span>
                                <div style={{
                                    width: '100%',
                                    height: `${barHeight}%`,
                                    background: `linear-gradient(to top, ${m.color}cc, ${m.color})`,
                                    borderRadius: '6px 6px 0 0',
                                    transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: `0 4px 12px ${m.color}33`
                                }}></div>
                                <span style={{
                                    fontSize: '0.65rem',
                                    color: '#64748b',
                                    fontWeight: 800,
                                    textAlign: 'center',
                                    marginTop: '8px',
                                    textTransform: 'uppercase',
                                    whiteSpace: 'nowrap'
                                }}>{m.name}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Live Data Table */}
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 900 }}>CANTEEN / UNIT</th>
                            <th style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 900 }}>ITEMS MOVED</th>
                            <th style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 900 }}>QTY (UNITS)</th>
                            <th style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 900 }}>LIVE REVENUE</th>
                            <th style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 900 }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locationMetrics.map((m, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '18px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: m.color }}></div>
                                        <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>{m.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '18px 24px', fontWeight: 700, color: '#334155' }}>{m.itemsMoved}</td>
                                <td style={{ padding: '18px 24px', fontWeight: 700, color: '#334155' }}>{m.qty}</td>
                                <td style={{ padding: '18px 24px', fontWeight: 800, color: m.revenue > 0 ? '#22c55e' : '#94a3b8' }}>
                                    ₹{m.revenue.toLocaleString()}
                                </td>
                                <td style={{ padding: '18px 24px' }}>
                                    {m.status === 'ACTIVE' ? (
                                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 14px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800 }}>ACTIVE</span>
                                    ) : (
                                        <span style={{ background: '#f1f5f9', color: '#64748b', padding: '6px 14px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid #e2e8f0' }}>NO DATA</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Trends Section */}
            <div className="table-container" style={{ marginTop: '30px', background: '#ffffff', borderRadius: '24px', padding: '30px', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '25px', textTransform: 'uppercase' }}>Recent Activity Trends</h3>
                <div style={{ height: '40px', background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                        Based on the last {todayTransfers.length} transactions recorded in the system.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LiveSalesTab;
