import React, { useState, useRef, useEffect } from 'react';
import usdFlag from '../../assets/flags/usd.svg';
import inrFlag from '../../assets/flags/inr.svg';
import eurFlag from '../../assets/flags/eur.svg';
import gbpFlag from '../../assets/flags/gbp.svg';
import jpyFlag from '../../assets/flags/jpy.svg';
import audFlag from '../../assets/flags/aud.svg';
import { ChevronDown } from 'lucide-react';

export const currencies = [
    { code: 'USD', symbol: '$', name: 'United States', flag: usdFlag },
    { code: 'INR', symbol: '₹', name: 'India', flag: inrFlag },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: eurFlag },
    { code: 'GBP', symbol: '£', name: 'United Kingdom', flag: gbpFlag },
    { code: 'JPY', symbol: '¥', name: 'Japan', flag: jpyFlag },
    { code: 'AUD', symbol: 'A$', name: 'Australia', flag: audFlag }
];

const CurrencySelector = ({ value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCurrency = currencies.find(c => c.code === value) || currencies[0];

    return (
        <div className={`currency-selector ${className || ''}`} ref={ref} style={{ position: 'relative', width: '100%' }}>
            <div
                className="input-field flex-between"
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: 'pointer', background: 'var(--card-bg)', userSelect: 'none' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={selectedCurrency.flag} alt="flag" width="20" height="14" style={{ borderRadius: '2px', objectFit: 'cover' }} />
                    <span>{selectedCurrency.code} ({selectedCurrency.symbol})</span>
                </div>
                <ChevronDown size={16} className="text-muted" />
            </div>
            {isOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', marginTop: '4px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
                    {currencies.map(c => (
                        <div
                            key={c.code}
                            onClick={() => { onChange(c.code); setIsOpen(false); }}
                            className="bg-color-hover"
                            style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.2s' }}
                        >
                            <img src={c.flag} alt="flag" width="20" height="14" style={{ borderRadius: '2px', objectFit: 'cover' }} />
                            <span>{c.code} ({c.symbol})</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CurrencySelector;
