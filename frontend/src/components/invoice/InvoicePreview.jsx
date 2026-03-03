import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { format } from 'date-fns';
import { currencies } from '../currency/CurrencySelector';

const InvoicePreview = ({ formData }) => {
    const total = formData.initialLines.reduce((acc, line) => acc + ((line.quantity || 0) * (line.unitPrice || 0)), 0);

    const getCurrencyCode = () => formData.currency || 'USD';

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: getCurrencyCode() }).format(amount || 0);
    };

    return (
        <Card className="invoice-preview-card p-40" style={{ background: '#fff', color: '#333' }}>
            <div className="preview-indicator" style={{ position: 'absolute', top: 0, right: 0, background: 'var(--pending)', color: '#fff', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, borderBottomLeftRadius: '8px', borderTopRightRadius: '12px' }}>
                Live Preview
            </div>

            <div className="invoice-header mb-20 pb-20 border-bottom">
                <div className="flex-between align-start">
                    <div>
                        <h1 className="text-strong text-large" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>INVOICE</h1>
                        <p className="text-muted">#{formData.invoiceNumber || 'INV-0000'}</p>
                    </div>
                    <div className="text-right">
                        <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-color)' }}>FinDash Inc.</div>
                        <div className="text-muted text-small mt-10">
                            123 SaaS Street<br />
                            San Francisco, CA 94105<br />
                            contact@findash.com
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-2 mb-20 pb-20 border-bottom">
                <div>
                    <div className="text-muted text-small mb-10 text-strong">BILL TO</div>
                    <div className="text-strong">{formData.customerName || 'Customer Name'}</div>
                    <div className="text-muted text-small mt-10" style={{ whiteSpace: 'pre-wrap' }}>
                        {formData.address || 'Customer Address\nCity, State, Zip'}
                    </div>
                </div>
                <div className="text-right">
                    <div className="grid-2" style={{ gap: '0.5rem', textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex-justify-end" style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
                            <span className="text-muted">Issue Date:</span>
                            <span className="text-strong">{formData.issueDate ? format(new Date(formData.issueDate), 'MMM dd, yyyy') : '-'}</span>
                        </div>
                        <div className="flex-justify-end" style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
                            <span className="text-muted">Due Date:</span>
                            <span className="text-strong">{formData.dueDate ? format(new Date(formData.dueDate), 'MMM dd, yyyy') : '-'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive mb-20">
                <table className="data-table" style={{ borderBottom: '1px solid var(--border)' }}>
                    <thead style={{ background: 'transparent', borderBottom: '2px solid #333' }}>
                        <tr>
                            <th className="text-left" style={{ paddingLeft: 0, color: '#333' }}>Item Description</th>
                            <th className="text-right" style={{ color: '#333' }}>Qty</th>
                            <th className="text-right" style={{ color: '#333' }}>Price</th>
                            <th className="text-right" style={{ paddingRight: 0, color: '#333' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.initialLines.length === 0 ? (
                            <tr><td colSpan="4" className="text-center text-muted py-20" style={{ padding: '2rem' }}>No items added</td></tr>
                        ) : (
                            formData.initialLines.map((line, idx) => (
                                <tr key={idx} style={{ background: 'transparent', borderBottom: '1px solid #eee' }}>
                                    <td className="text-left" style={{ paddingLeft: 0 }}>{line.description || '-'}</td>
                                    <td className="text-right text-muted">{line.quantity || 0}</td>
                                    <td className="text-right text-muted">{formatCurrency(line.unitPrice)}</td>
                                    <td className="text-right text-strong" style={{ paddingRight: 0 }}>{formatCurrency((line.quantity || 0) * (line.unitPrice || 0))}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex-end">
                <div style={{ width: '300px' }}>
                    <div className="summary-row mb-10">
                        <span className="text-muted">Subtotal</span>
                        <span className="text-strong">{formatCurrency(total)}</span>
                    </div>
                    <div className="summary-row mb-10 pb-10 border-bottom">
                        <span className="text-muted">Tax (0%)</span>
                        <span className="text-strong">{formatCurrency(0)}</span>
                    </div>
                    <div className="summary-row mt-10">
                        <span className="text-strong" style={{ fontSize: '1.25rem' }}>Total</span>
                        <span className="text-strong" style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-20 pt-20 border-top text-center text-muted text-small">
                Thank you for your business!
            </div>
        </Card>
    );
};

export default InvoicePreview;
