import React from 'react';

const SearchableSelect = ({
    placeholder,
    value,
    onChange,
    onFocus,
    isOpen,
    dropdownRef,
    results,
    renderResult,
    noResultsText = "No items found"
}) => {
    return (
        <div className="searchable-select" style={{ border: 'none' }} ref={dropdownRef}>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                style={{
                    background: '#ffffff',
                    border: '1px solid #7c3aed',
                    color: '#0f172a',
                    borderRadius: '8px',
                    padding: '16px',
                    width: '100%',
                    fontSize: '15px'
                }}
                onChange={onChange}
                onFocus={onFocus}
            />
            {isOpen && (
                <div className="dropdown-results custom-scrollbar" style={{
                    background: '#ffffff',
                    border: '1px solid #7c3aed',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}>
                    {results.length > 0 ? (
                        results.map((item, idx) => (
                            <div key={idx} onClick={() => renderResult.onClick(item)}>
                                {renderResult.content(item)}
                            </div>
                        ))
                    ) : (
                        <div className="no-results" style={{ color: '#64748b' }}>{noResultsText}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
