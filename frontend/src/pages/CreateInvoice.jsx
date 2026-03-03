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
        invoiceNumber: '',
        customerName: '',
        issueDate: '',
        dueDate: '',
        initialLines: []
    });

    const handleSave = async () => {
        try {
            const newInvoice = await create(formData);
            addNotification('Invoice created successfully!');
            navigate(`/invoices/${newInvoice._id}`);
        } catch (err) {
            addNotification('Failed to create invoice', 'error');
        }
    };

    return (
        <div className="grid-2 mt-20">
            <div className="form-section">
                <InvoiceForm
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSave}
                    isSaving={loading}
                />
            </div>
            <div className="preview-section d-none-mobile">
                <InvoicePreview formData={formData} />
            </div>
        </div>
    );
};

export default CreateInvoice;
