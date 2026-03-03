import React from 'react';
import Card from '../common/Card';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Table from '../common/Table';

const InvoiceForm = ({ formData, setFormData, onSave, isSaving }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLineChange = (index, field, value) => {
        const updated = [...formData.initialLines];
        updated[index][field] = value;
        setFormData({ ...formData, initialLines: updated });
    };

    const addLine = () => {
        setFormData({
            ...formData,
            initialLines: [...formData.initialLines, { description: '', quantity: 1, unitPrice: 0 }]
        });
    };

    const removeLine = (index) => {
        const updated = formData.initialLines.filter((_, i) => i !== index);
        setFormData({ ...formData, initialLines: updated });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    return (
        <Card className="invoice-form-card">
            <h2 className="section-title">Create New Invoice</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid-2">
                    <InputField label="Invoice Number" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required />
                    <InputField label="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
                </div>
                <div className="grid-2">
                    <InputField label="Issue Date" type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required />
                    <InputField label="Due Date" type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
                </div>

                <div className="mt-20">
                    <div className="flex-between mb-10">
                        <h3 className="section-title">Line Items</h3>
                        <Button variant="secondary" onClick={addLine}>Add Item</Button>
                    </div>

                    {formData.initialLines.length > 0 ? (
                        <Table>
                            <thead>
                                <tr>
                                    <th className="text-left">Description</th>
                                    <th className="text-right">Quantity</th>
                                    <th className="text-right">Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.initialLines.map((line, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                className="input-field"
                                                value={line.description}
                                                onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="input-field text-right"
                                                value={line.quantity}
                                                min="1"
                                                onChange={(e) => handleLineChange(index, 'quantity', parseFloat(e.target.value))}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="input-field text-right"
                                                value={line.unitPrice}
                                                min="0" step="0.01"
                                                onChange={(e) => handleLineChange(index, 'unitPrice', parseFloat(e.target.value))}
                                                required
                                            />
                                        </td>
                                        <td className="text-right">
                                            <Button variant="secondary" onClick={() => removeLine(index)}>X</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-muted text-center pt-10 pb-10">No items added yet</p>
                    )}
                </div>

                <div className="flex-end mt-20">
                    <Button type="submit" disabled={isSaving || formData.initialLines.length === 0}>
                        {isSaving ? 'Saving...' : 'Save Invoice'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default InvoiceForm;
