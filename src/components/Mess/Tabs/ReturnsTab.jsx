import React from 'react';
import { RotateCcw, CheckCircle } from 'lucide-react';

const ReturnsTab = ({ returnItems, globalProductionUnit, handleAcceptReturn }) => {
    const filteredReturnItems = returnItems.filter(item =>
        (item.status === 'Pending' || item.status === 'Accepted') &&
        item.to &&
        item.to.toLowerCase() === globalProductionUnit.toLowerCase()
    );

    return (
        <div className="content-card animate-fadeIn">
            <div className="card-header pb-4 border-b border-[#222]">
                <div>
                    <h2 className="tracking-wide">Return Items</h2>
                </div>
            </div>

            <div className="table-container mt-8 relative">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Items Returned</th>
                            <th>Quantity</th>
                            <th>From Sales Point</th>
                            <th>Reason for Return</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReturnItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td className="font-bold tracking-tight text-black">{item.item}</td>
                                <td>{item.qty}</td>
                                <td>{item.from}</td>
                                <td><span className="text-red-400">{item.reason}</span></td>
                                <td>
                                    <span className={`status-badge ${item.status === 'Pending' ? 'waiting' : 'completed'} flex items-center justify-center gap-1`}>
                                        {item.status === 'Accepted' && <CheckCircle size={12} className="text-green-400" />}
                                        {item.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    {item.status === 'Pending' ? (
                                        <button className="primary-btn-sm success" onClick={() => handleAcceptReturn(item.id)}>ACCEPT REQUEST</button>
                                    ) : (
                                        <div className="flex items-center justify-center text-green-500 font-bold gap-2 py-2">
                                            <CheckCircle size={18} />
                                            <span style={{ fontSize: '12px', letterSpacing: '1px' }}>COMPLETED</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredReturnItems.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center gap-2 opacity-60">
                                        <RotateCcw size={32} className="text-gray-500 mb-2" />
                                        <p className="text-gray-400 font-bold">No return requests found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReturnsTab;
