import SearchableSelect from '../Common/SearchableSelect';

const AddItemsTab = ({
    currentDate,
    newItem,
    setNewItem,
    globalProductionUnit,
    setGlobalProductionUnit,
    productionUnitsList,
    handleAddItem,
    dynamicCategoryItems = {}
}) => {
    return (
        <div className="content-card animate-fadeIn">
            <div className="card-header pb-4 border-b border-[#222]">
                <div>
                    <h2>Add Items</h2>
                </div>
            </div>

            {/* Production Form */}
            <div className="mt-6 mb-8 p-6 bg-[#111] border border-[#222] rounded-xl max-w-xl" style={{ maxWidth: '600px' }}>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }} onSubmit={handleAddItem}>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="text"
                            className="dark-field bg-[#222] text-gray-400 cursor-not-allowed"
                            value={currentDate}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label>Item Category</label>
                        <SearchableSelect
                            options={Object.keys(dynamicCategoryItems)}
                            value={newItem.category}
                            onChange={(newCat) => {
                                setNewItem({
                                    ...newItem,
                                    category: newCat,
                                    name: dynamicCategoryItems[newCat][0] || '',
                                    qty: '',
                                    price: '',
                                    confirmed: false
                                });
                            }}
                            placeholder="Select Category"
                        />
                    </div>

                    <div className="form-group">
                        <label>Item Name</label>
                        <SearchableSelect
                            options={dynamicCategoryItems[newItem.category] || []}
                            value={newItem.name}
                            onChange={(newName) => setNewItem({
                                ...newItem,
                                name: newName,
                                qty: '',
                                price: '',
                                confirmed: false
                            })}
                            placeholder="Select Item"
                        />
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Enter quantity"
                            className="dark-field"
                            value={newItem.qty}
                            onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                            onWheel={(e) => e.target.blur()}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price per unit (₹)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="dark-field"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            onWheel={(e) => e.target.blur()}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Total for entered qty (₹)</label>
                        <input
                            type="text"
                            className="dark-field bg-[#222] text-gray-400 cursor-not-allowed"
                            value={newItem.qty && newItem.price ? (parseFloat(newItem.qty) * parseFloat(newItem.price)).toFixed(2) : '0.00'}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label>From which production unit</label>
                        <select
                            className="dark-field"
                            value={globalProductionUnit}
                            onChange={(e) => setGlobalProductionUnit(e.target.value)}
                            required
                        >
                            {productionUnitsList.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group md:col-span-2" style={{ gridColumn: '1 / -1' }}>
                        <label className="flex items-center cursor-pointer p-3 bg-[#1a1a1a] border border-[#333] rounded-lg" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-red-500 rounded cursor-pointer flex-shrink-0"
                                style={{ marginRight: '16px', width: '20px', height: '20px', flexShrink: 0 }}
                                checked={newItem.confirmed}
                                onChange={(e) => setNewItem({ ...newItem, confirmed: e.target.checked })}
                            />
                            <span className="text-sm text-gray-300" style={{ fontSize: '0.875rem', color: '#475569' }}>I confirm the addition of these items to the production list</span>
                        </label>
                    </div>

                    <div className="form-group md:col-span-2 flex flex-col items-end gap-3" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                        <button
                            type="submit"
                            className="primary-btn px-8 w-full md:w-auto"
                            disabled={!newItem.confirmed}
                            style={{ opacity: newItem.confirmed ? 1 : 0.5 }}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemsTab;
