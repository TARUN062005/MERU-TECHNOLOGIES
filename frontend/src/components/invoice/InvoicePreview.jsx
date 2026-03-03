import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { format } from 'date-fns';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
};

const InvoicePreview = ({ formData }) => {
    const total = formData.initialLines.reduce((acc, line) => acc + ((line.quantity || 0) * (line.unitPrice || 0)), 0);

    return (
        <Card className="invoice-preview-card">
            <div className="preview-indicator">Live Preview</div>
            <div className="invoice-header mb-20">
                <div className="flex-between">
                    <div>
                        <h1 className="invoice-title">#{formData.invoiceNumber || 'INV-XXX'}</h1>
                        <p className="customer-name">{formData.customerName || 'Customer Name'}</p>
                    </div>
                    <Badge status="DRAFT" />
                </div>
                <div className="grid-2 mt-20">
                    <div className="date-group">
                        <span className="date-label">Issue Date</span>
                        <span className="date-value">
                            {formData.issueDate ? format(new Date(formData.issueDate), 'MMM dd, yyyy') : '-'}
                        </span>
                    </div>
                    <div className="date-group text-right">
                        <span className="date-label">Due Date</span>
                        <span className="date-value text-strong">
                            {formData.dueDate ? format(new Date(formData.dueDate), 'MMM dd, yyyy') : '-'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="text-left">Description</th>
                            <th className="text-right">Qty</th>
                            <th className="text-right">Price</th>
                            <th className="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.initialLines.map((line, idx) => (
                            <tr key={idx}>
                                <td className="text-left">{line.description || '-'}</td>
                                <td className="text-right">{line.quantity || 0}</td>
                                <td className="text-right">{formatCurrency(line.unitPrice)}</td>
                                <td className="text-right text-strong">{formatCurrency((line.quantity || 0) * (line.unitPrice || 0))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="totals-container mt-20 pt-10 border-top">
                <div className="summary-row">
                    <span>Total</span>
                    <span className="text-strong">{formatCurrency(total)}</span>
                </div>
                <div className="summary-row text-success">
                    <span>Amount Paid</span>
                    <span>-{formatCurrency(0)}</span>
                </div>
                <div className="summary-row text-strong text-large border-top mt-10 pt-10">
                    <span>Balance Due</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>
        </Card>
    );
};

export default InvoicePreview;
