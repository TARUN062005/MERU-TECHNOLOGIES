import React from 'react';

const Button = ({ children, onClick, disabled, variant = 'primary', type = 'button', className = '' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
