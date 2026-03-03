import React from 'react';
import usdFlag from '../../assets/flags/usd.svg';
import inrFlag from '../../assets/flags/inr.svg';
import eurFlag from '../../assets/flags/eur.svg';
import gbpFlag from '../../assets/flags/gbp.svg';
import jpyFlag from '../../assets/flags/jpy.svg';
import audFlag from '../../assets/flags/aud.svg';

export const currencies = [
    { code: 'USD', symbol: '$', name: 'United States', flag: usdFlag },
    { code: 'INR', symbol: '₹', name: 'India', flag: inrFlag },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: eurFlag },
    { code: 'GBP', symbol: '£', name: 'United Kingdom', flag: gbpFlag },
    { code: 'JPY', symbol: '¥', name: 'Japan', flag: jpyFlag },
    { code: 'AUD', symbol: 'A$', name: 'Australia', flag: audFlag }
];

const CurrencySelector = ({ value, onChange, className }) => {
    return (
        <div className={`currency-selector ${className || ''}`}>
            <select
                className="input-field pl-40"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ appearance: 'none' }}
            >
                {currencies.map(c => (
                    <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol})
                    </option>
                ))}
            </select>
            {value && (
                <div className="selected-flag-icon">
                    <img
                        src={currencies.find(c => c.code === value)?.flag}
                        alt="flag"
                        width="24"
                        height="16"
                    />
                </div>
            )}
        </div>
    );
};

export default CurrencySelector;
