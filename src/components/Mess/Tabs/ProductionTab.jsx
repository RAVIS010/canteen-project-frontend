import React from 'react';
import { Trash2, Utensils } from 'lucide-react';

const ProductionTab = ({ productionItems, handleDeleteProduction, selectedItemName }) => {
    return (
        <div className="content-card animate-fadeIn">
            <div className="card-header pb-4 border-b border-[#222]">
                <div>
                    <h2>Production List</h2>
                </div>
            </div>

            {/* Production Cards */}
            <div className="production-cards-container">
                {productionItems.filter(item => item.qty > 0 && item.name === selectedItemName).length === 0 ? (
                    <div className="empty-state-box grid-span-full">
                        {selectedItemName ? `No production records found for "${selectedItemName}".` : "Please select an item to view its production status."}
                    </div>
                ) : (
                    productionItems
                        .filter(item => item.qty > 0 && item.name === selectedItemName)
                        .map((item, idx) => (
                            <div key={item._id || idx} className="production-item-card animate-fadeIn">
                                <button
                                    className="delete-pic-btn"
                                    onClick={() => handleDeleteProduction(item._id, item.name, item.qty, item.category, item.location)}
                                    title="Delete Entry"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <div className="pic-header">
                                    <div className="pic-icon-wrapper">
                                        <Utensils size={14} className="pic-icon" />
                                    </div>
                                    <h3 className="pic-title" title={item.name}>{item.name}</h3>
                                </div>
                                <div className="pic-body">
                                    <div className="pic-stat">
                                        <span className="pic-label">Qty</span>
                                        <span className={`pic-value ${item.qty == 0 ? 'text-red-500' : ''}`}>{item.qty}</span>
                                    </div>
                                    <div className="pic-stat text-center">
                                        <span className="pic-label">Total Amt</span>
                                        <span className="pic-value total">₹{(item.qty * item.price).toFixed(2)}</span>
                                    </div>
                                    <div className="pic-stat text-right">
                                        <span className="pic-label">₹ / Unit</span>
                                        <span className="pic-value highlight">₹{item.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
};

export default ProductionTab;
