import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import { useNotification } from '../context/NotificationContext';
import InvoiceForm from '../components/invoice/InvoiceForm';
import InvoicePreview from '../components/invoice/InvoicePreview';

const CreateInvoice = () => {
    const navigate = useNavigate();
    const { create, loading } = useCreateInvoice();
    const { addNotification } = useNotification();

    const [formData, setFormData] = useState({
        invoiceNumber: `INV-${Math.floor(Date.now() / 1000)}`,
        customerName: '',
        address: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        currency: 'USD',
        initialLines: []
    });

    const handleSave = async () => {
        try {
            const newInvoice = await create(formData);
            addNotification('Invoice created successfully!', 'success');
            navigate(`/invoices/${newInvoice._id}`);
        } catch (err) {
            addNotification('Failed to create invoice', 'error');
        }
    };

    return (
        <div className="mt-20">
            <h1 className="section-title text-large mb-20 m-0">Create New Invoice</h1>
            <div className="split-layout">
                <div className="form-section">
                    <InvoiceForm
                        formData={formData}
                        setFormData={setFormData}
                        onSave={handleSave}
                        isSaving={loading}
                    />
                </div>
                <div className="preview-section">
                    <InvoicePreview formData={formData} />
                </div>
            </div>
        </div>
    );
};

export default CreateInvoice;
