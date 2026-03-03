import React from 'react';
import { format } from 'date-fns';
import EmptyState from '../common/EmptyState';

const PaymentList = ({ payments, currency = 'USD' }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount || 0);
    };

    if (!payments || payments.length === 0) return <EmptyState message="No payments recorded yet" />;

    return (
        <div className="payment-list">
            {payments.map(payment => (
                <div key={payment._id} className="payment-item flex-between border-bottom pb-10 mb-10">
                    <div className="payment-info">
                        <span className="payment-date text-muted block text-small">
                            {format(new Date(payment.paymentDate), 'MMM dd, yyyy - h:mm a')}
                        </span>
                        <span className="payment-method text-small">Payment Processed</span>
                    </div>
                    <div className="payment-amount text-success text-strong">
                        +{formatCurrency(payment.amount)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PaymentList;
