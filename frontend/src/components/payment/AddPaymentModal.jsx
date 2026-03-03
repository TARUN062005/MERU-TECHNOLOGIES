import React, { useState } from 'react';
import Modal from '../common/Modal';
import InputField from '../common/InputField';
import Button from '../common/Button';

const AddPaymentModal = ({ isOpen, onClose, balanceDue, onSubmit }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const paymentAmount = parseFloat(amount);

        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            setError('Please enter a valid amount greater than 0');
            return;
        }

        if (paymentAmount > balanceDue) {
            setError(`Amount cannot exceed balance due ($${balanceDue.toFixed(2)})`);
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(paymentAmount);
            setAmount('');
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to process payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Payment">
            <form onSubmit={handleSubmit} className="payment-form">
                <p className="mb-15 text-muted">Remaining Balance: <strong>${balanceDue?.toFixed(2)}</strong></p>

                <InputField
                    label="Payment Amount ($)"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                    error={error}
                />

                <div className="form-actions flex-end mt-20">
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting} className="mr-10">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !amount}>
                        {isSubmitting ? 'Processing...' : 'Submit Payment'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddPaymentModal;
