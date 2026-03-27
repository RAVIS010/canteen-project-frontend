import React from 'react';
import './common.css';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseClass = 'common-button';
    const variantClass = `common-button-${variant}`;
    const widthClass = fullWidth ? 'common-button-full' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseClass} ${variantClass} ${widthClass} ${className}`.trim()}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
