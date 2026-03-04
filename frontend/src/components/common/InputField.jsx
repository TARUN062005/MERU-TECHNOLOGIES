import React from 'react';

const InputField = ({ label, type = 'text', name, value, defaultValue, readOnly, style, onChange, required, min, step, placeholder }) => {
    return (
        <div className="input-group">
            {label && <label>{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                defaultValue={defaultValue}
                readOnly={readOnly}
                style={style}
                onChange={onChange}
                required={required}
                min={min}
                step={step}
                placeholder={placeholder}
                className="input-field"
            />
        </div>
    );
};

export default InputField;
