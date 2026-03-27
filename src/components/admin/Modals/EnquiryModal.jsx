import '../Admin.css';
import React from 'react';

const EnquiryModal = ({ enquiryDetailLog, setEnquiryDetailLog, handleConfirmEnquiry }) => {
    if (!enquiryDetailLog) return null;

    return (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
            <div className="modal-content" style={{ maxWidth: '500px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '20px', color: '#0f172a' }}>Enquiry Details</h2>

                <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px' }}>User: <strong style={{ color: '#0f172a' }}>{enquiryDetailLog.user}</strong></p>
                    <p style={{ color: '#475569', fontSize: '0.9rem' }}>Shift: <span className="category-tag">{enquiryDetailLog.shift}</span></p>
                </div>

                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <h4 style={{ color: '#44eb44', marginBottom: '5px', fontSize: '0.85rem' }}>LATE LOGIN REASON</h4>
                        <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.4' }}>{enquiryDetailLog.lateLoginReason}</p>
                    </div>
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                        <h4 style={{ color: '#ff4d4d', marginBottom: '5px', fontSize: '0.85rem' }}>LATE LOGOUT REASON</h4>
                        <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.4' }}>{enquiryDetailLog.lateLogoutReason}</p>
                    </div>
                </div>

                <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button className="text-btn" onClick={() => setEnquiryDetailLog(null)} style={{ color: '#475569' }}>Close</button>
                    <button
                        className="primary-btn"
                        style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                        onClick={() => handleConfirmEnquiry(enquiryDetailLog.id)}
                    >
                        CONFIRM ENQUIRY
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnquiryModal;
