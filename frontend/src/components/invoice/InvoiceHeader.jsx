import React from 'react';
import { format } from 'date-fns';
import StatusPill from '../common/StatusPill';
import Card from '../common/Card';

const InvoiceHeader = ({ invoice }) => {
    const isOverdue = invoice.dueDate ? new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID' : false;

    return (
        <Card className="invoice-header mb-20 section-container">
            <div className="header-top flex-between">
                <div>
                    <h1 className="invoice-title">Invoice #{invoice.invoiceNumber}</h1>
                    <p className="customer-name">{invoice.customerName}</p>
                </div>
                <div>
                    <StatusPill status={invoice.status} isOverdue={isOverdue} />
                </div>
            </div>

            <div className="header-bottom grid-2">
                <div className="date-group">
                    <span className="date-label">Issue Date</span>
                    <span className="date-value">
                        {invoice.issueDate ? format(new Date(invoice.issueDate), 'MMM dd, yyyy') : 'N/A'}
                    </span>
                </div>
                <div className="date-group text-right">
                    <span className="date-label">Due Date</span>
                    <span className="date-value text-strong">
                        {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM dd, yyyy') : 'N/A'}
                    </span>
                </div>
            </div>
        </Card>
    );
};

export default InvoiceHeader;
