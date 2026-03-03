import React, { useState } from 'react';
import Modal from '../common/Modal';
import InputField from '../common/InputField';
import Button from '../common/Button';

const AddPaymentModal = ({ isOpen, onClose, balanceDue, onSubmit }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // This line was intended to be highlighted, not changed.

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const paymentAmount = parseFloat(amount);

        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            setError('Enter a valid amount');
            return;
        }

        if (paymentAmount > balanceDue) {
            setError(`Cannot exceed balance due ($${balanceDue.toFixed(2)})`);
            return;
        }

        setLoading(true);
        try {
            await onSubmit(paymentAmount);
            setAmount('');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
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
                />
                {error && <span className="error-text block mb-10">{error}</span>}

                <div className="flex-end mt-20 gap-10">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" disabled={loading || !amount}>{loading ? 'Processing...' : 'Submit Payment'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddPaymentModal;
