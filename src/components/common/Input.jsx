import React from 'react';
import './common.css';

const Input = ({
    label,
    icon: Icon,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    rightElement,
    ...props
}) => {
    return (
        <div className="common-input-group">
            {label && <label className="common-input-label">{label}</label>}
            <div className="common-input-wrapper">
                {Icon && <Icon className="common-input-icon-left" size={20} />}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`common-input ${Icon ? 'has-icon-left' : ''} ${rightElement ? 'has-icon-right' : ''}`}
                    {...props}
                />
                {rightElement && <div className="common-input-icon-right">{rightElement}</div>}
            </div>
        </div>
    );
};

export default Input;
