import React from 'react';
import Table from '../common/Table';
import EmptyState from '../common/EmptyState';

const InvoiceLineItems = ({ items, currency = 'USD' }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount || 0);
    };

    if (!items || items.length === 0) return <EmptyState message="No line items found" />;

    return (
        <Table>
            <thead>
                <tr>
                    <th className="text-left">Description</th>
                    <th className="text-right">Quantity</th>
                    <th className="text-right">Unit Price</th>
                    <th className="text-right">Line Total</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item._id}>
                        <td data-label="Description" className="text-left">{item.description}</td>
                        <td data-label="Quantity" className="text-right">{item.quantity}</td>
                        <td data-label="Unit Price" className="text-right">{formatCurrency(item.unitPrice)}</td>
                        <td data-label="Line Total" className="text-right text-strong">{formatCurrency(item.lineTotal)}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default InvoiceLineItems;
