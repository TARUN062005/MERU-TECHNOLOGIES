import React from 'react';
import Card from '../common/Card';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Table from '../common/Table';
import CurrencySelector from '../currency/CurrencySelector';
import { Plus, Trash2 } from 'lucide-react';

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
        <Card className="p-0 border-0 shadow-0" style={{ boxShadow: 'none', border: 'none', background: 'transparent' }}>
            <form onSubmit={handleSubmit}>
                <Card className="mb-20">
                    <h2 className="section-title mb-15">Invoice Details</h2>
                    <div className="grid-2 mb-15">
                        <InputField label="Invoice Number" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required />
                        <InputField label="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Client Address</label>
                        <textarea className="input-field" rows="2" name="address" value={formData.address} onChange={handleChange}></textarea>
                    </div>
                    <div className="grid-2 mt-15 mb-15">
                        <InputField label="Issue Date" type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required />
                        <InputField label="Due Date" type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Currency</label>
                        <CurrencySelector value={formData.currency} onChange={(val) => setFormData({ ...formData, currency: val })} />
                    </div>
                </Card>

                <Card className="mb-20">
                    <div className="flex-between mb-15">
                        <h3 className="section-title m-0">Line Items</h3>
                        <Button variant="secondary" onClick={addLine} type="button"><Plus size={16} /> Add Item</Button>
                    </div>

                    {formData.initialLines.length > 0 ? (
                        <div className="table-responsive">
                            <table className="data-table">
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
                                                <Button variant="secondary" onClick={() => removeLine(index)} type="button"><Trash2 size={16} className="text-error" /></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state mt-10" style={{ padding: '2rem' }}>
                            No items added yet. Click 'Add Item' to start.
                        </div>
                    )}
                </Card>

                <div className="flex-end mt-20 gap-10">
                    <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => onSave(true)}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save as Draft'}
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={(e) => { e.preventDefault(); onSave(false); }}
                        disabled={isSaving || formData.initialLines.length === 0}
                    >
                        {isSaving ? 'Saving...' : 'Save & Send'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default InvoiceForm;
