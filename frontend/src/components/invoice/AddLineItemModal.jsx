import React, { useState } from 'react';
import Modal from '../common/Modal';
import InputField from '../common/InputField';
import Button from '../common/Button';

const AddLineItemModal = ({ isOpen, onClose, onSubmit }) => {
    const [data, setData] = useState({ description: '', quantity: 1, unitPrice: 0 });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ ...data, quantity: Number(data.quantity), unitPrice: Number(data.unitPrice) });
            setData({ description: '', quantity: 1, unitPrice: 0 });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Line Item">
            <form onSubmit={handleSubmit}>
                <InputField label="Description" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} required />
                <InputField label="Quantity" type="number" min="1" value={data.quantity} onChange={(e) => setData({ ...data, quantity: e.target.value })} required />
                <InputField label="Unit Price" type="number" min="0" step="0.01" value={data.unitPrice} onChange={(e) => setData({ ...data, unitPrice: e.target.value })} required />
                <div className="flex-end mt-20 gap-10">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Item'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddLineItemModal;
