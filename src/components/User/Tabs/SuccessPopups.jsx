import React from 'react';

const SuccessPopups = ({
    showTransferSuccess,
    transferSuccessMsg,
    showReturnSuccess,
    returnSuccessMsg,
    userName
}) => {
    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {showTransferSuccess && (
                <div className="animate-slideInRight" style={{
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                    color: '#fff',
                    padding: '20px 32px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
                    border: '1px solid #3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#3b82f6' }}></div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#60a5fa', marginBottom: '4px' }}>Transfer Successful</div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{transferSuccessMsg}</div>
                    </div>
                </div>
            )}

            {showReturnSuccess && (
                <div className="animate-slideInRight" style={{
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                    color: '#fff',
                    padding: '20px 32px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
                    border: '1px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#10b981' }}></div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#34d399', marginBottom: '4px' }}>Return Confirmed</div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{returnSuccessMsg}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuccessPopups;
