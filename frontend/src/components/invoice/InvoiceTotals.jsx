import React from 'react';

const InvoiceTotals = ({ total, amountPaid, balanceDue, currency = 'USD' }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount || 0);
    };

    return (
        <div className="totals-container">
            <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
            </div>
            <div className="summary-row amount-paid text-success">
                <span>Amount Paid</span>
                <span>-{formatCurrency(amountPaid)}</span>
            </div>
            <div className="summary-row balance-due text-strong text-large border-top mt-10 pt-10">
                <span>Balance Due</span>
                <span>{formatCurrency(balanceDue)}</span>
            </div>
        </div>
    );
};

export default InvoiceTotals;
