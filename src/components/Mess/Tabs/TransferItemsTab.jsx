import SearchableSelect from '../Common/SearchableSelect';

const TransferItemsTab = ({
    currentDate,
    transferItem,
    setTransferItem,
    globalProductionUnit,
    setGlobalProductionUnit,
    productionUnitsList,
    canteensList,
    handleTransferItem,
    dynamicCategoryItems = {}
}) => {
    return (
        <div className="content-card animate-fadeIn">
            <div className="card-header pb-4 border-b border-[#222]">
                <div>
                    <h2>Transfer Items</h2>
                </div>
            </div>
            <div className="mt-6 mb-8 p-6 bg-[#111] border border-[#222] rounded-xl max-w-xl" style={{ maxWidth: '600px' }}>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }} onSubmit={handleTransferItem}>

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
                            value={transferItem.category}
                            onChange={(newCat) => {
                                setTransferItem({
                                    ...transferItem,
                                    category: newCat,
                                    name: dynamicCategoryItems[newCat][0]
                                });
                            }}
                            placeholder="Select Category"
                        />
                    </div>

                    <div className="form-group">
                        <label>Item Name</label>
                        <SearchableSelect
                            options={dynamicCategoryItems[transferItem.category] || []}
                            value={transferItem.name}
                            onChange={(newName) => setTransferItem({ ...transferItem, name: newName })}
                            placeholder="Select Item"
                        />
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Enter quantity to transfer"
                            className="dark-field"
                            value={transferItem.qty}
                            onChange={(e) => setTransferItem({ ...transferItem, qty: e.target.value })}
                            onWheel={(e) => e.target.blur()}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>From Production Unit</label>
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

                    <div className="form-group">
                        <label>To Destination</label>
                        <select
                            className="dark-field"
                            value={transferItem.salesPoint}
                            onChange={(e) => setTransferItem({ ...transferItem, salesPoint: e.target.value })}
                            required
                        >
                            <optgroup label="Sales Points">
                                {canteensList.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Production Units">
                                {productionUnitsList.filter(u => u !== globalProductionUnit).map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    <div className="form-group md:col-span-2" style={{ gridColumn: '1 / -1' }}>
                        <label className="flex items-center cursor-pointer mt-4 p-4 bg-[#1a1a1a] border border-[#333] rounded-lg" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '16px' }}>
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-red-500 rounded cursor-pointer flex-shrink-0"
                                style={{ marginRight: '16px', width: '20px', height: '20px', flexShrink: 0 }}
                                checked={transferItem.confirmed}
                                onChange={(e) => setTransferItem({ ...transferItem, confirmed: e.target.checked })}
                            />
                            <span className="text-sm text-gray-300" style={{ fontSize: '0.875rem', color: '#475569' }}>I confirm the transfer of these items to the selected destination</span>
                        </label>
                    </div>

                    <div className="form-group md:col-span-2 flex flex-col items-end gap-3" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                        <button
                            type="submit"
                            className="primary-btn px-8"
                            disabled={!transferItem.confirmed}
                            style={{ opacity: transferItem.confirmed ? 1 : 0.5 }}
                        >
                            Submit Transfer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferItemsTab;
