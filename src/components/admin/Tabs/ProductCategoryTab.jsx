import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, FolderPlus, Layers } from 'lucide-react';
import '../Admin.css';

const ProductCategoryTab = ({
    localProductCategories,
    newProduct,
    setNewProduct,
    handleAddProduct,
    handleRemoveProduct,
    handleAddCategory,
    handleDeleteCategory
}) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const onAddCategory = () => {
        if (!newCategoryName.trim()) return;
        handleAddCategory(newCategoryName.trim().toUpperCase());
        setNewCategoryName('');
    };

    return (
        <div className="product-category-container animate-fadeIn" style={{ padding: '0px' }}>
            {/* Header section as seen in the image */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Product Categories
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
                    {currentTime.toLocaleDateString('en-GB')} | {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </p>
            </div>

            <div className="product-category-layout" style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px' }}>
                <div className="category-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {/* Category Management Card */}
                    <div style={{
                        background: '#ffffff',
                        padding: '30px',
                        borderRadius: '24px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                            <div style={{ background: '#f5f3ff', padding: '10px', borderRadius: '12px' }}>
                                <FolderPlus size={22} color="#7c3aed" />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1e293b' }}>MANAGE CATEGORIES</h3>
                        </div>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>New Category Name</label>
                            <input
                                type="text"
                                placeholder="e.g. DESSERTS"
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: '#f8fafc',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    outline: 'none'
                                }}
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={onAddCategory}
                            style={{
                                width: '100%',
                                background: '#7c3aed',
                                color: 'white',
                                border: 'none',
                                padding: '16px',
                                borderRadius: '14px',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase',
                                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
                            }}
                        >
                            Create Category
                        </button>
                    </div>

                    {/* Product Management Card */}
                    <div style={{
                        background: '#ffffff',
                        padding: '30px',
                        borderRadius: '24px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                            <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px' }}>
                                <PlusCircle size={22} color="#0f172a" />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1e293b' }}>QUICK ADD PRODUCT</h3>
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Select Category</label>
                            <select
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: '#f8fafc',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            >
                                <option value="">Choose category...</option>
                                {localProductCategories.map(c => (
                                    <option key={c.category} value={c.category}>{c.category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Product Name</label>
                            <input
                                type="text"
                                placeholder="Enter item name"
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: '#f8fafc',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    outline: 'none'
                                }}
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value.toUpperCase() })}
                            />
                        </div>


                        <button
                            onClick={handleAddProduct}
                            style={{
                                width: '100%',
                                background: '#0f172a',
                                color: 'white',
                                border: 'none',
                                padding: '16px',
                                borderRadius: '14px',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase',
                                marginBottom: '12px'
                            }}
                        >
                            Add To Category
                        </button>

                        <button
                            onClick={handleRemoveProduct}
                            style={{
                                width: '100%',
                                background: '#fff1f2',
                                color: '#e11d48',
                                border: '1px solid #ffe4e6',
                                padding: '16px',
                                borderRadius: '14px',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase'
                            }}
                        >
                            Remove Product
                        </button>
                    </div>
                </div>

                <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px', alignContent: 'start' }}>
                    {localProductCategories.map((cat, idx) => (
                        <div key={idx} style={{
                            background: '#ffffff',
                            borderRadius: '24px',
                            border: '1px solid #f1f5f9',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{
                                padding: '25px',
                                borderBottom: '1px solid #f8fafc',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#7c3aed', textTransform: 'uppercase' }}>
                                        {cat.category}
                                    </h3>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {cat.items.length} Products
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '12px',
                                        color: '#ef4444',
                                        border: 'none',
                                        background: '#fef2f2',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {cat.items.length > 0 ? (
                                            cat.items.map((item, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                    <td style={{ padding: '15px 25px', fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>
                                                        {item.name}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 20px', fontSize: '0.85rem', fontWeight: 600 }}>
                                                    No products added yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCategoryTab;
