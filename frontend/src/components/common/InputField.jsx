import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder, min, step, required, error }) => {
    return (
        <div className="input-field-group">
            {label && <label className="input-label">{label}</label>}
            <input
                type={type}
                className={`input-control ${error ? 'input-error' : ''}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                min={min}
                step={step}
                required={required}
            />
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

export default InputField;
