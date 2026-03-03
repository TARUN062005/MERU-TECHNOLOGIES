import React from 'react';
import { format } from 'date-fns';
import Badge from '../common/Badge';
import Card from '../common/Card';
import Button from '../common/Button';

const InvoiceHeader = ({ invoice, onArchive, onRestore }) => {
    return (
        <Card className="invoice-header mb-20 section-container">
            <div className="header-top flex-between">
                <div>
                    <h1 className="invoice-title flex-align-center">
                        #{invoice.invoiceNumber}
                        {invoice.isArchived && <span className="ml-10 text-muted text-small">(Archived)</span>}
                    </h1>
                    <p className="customer-name">{invoice.customerName}</p>
                </div>
                <div className="flex-end gap-10">
                    <Badge status={invoice.status} isArchived={invoice.isArchived} />
                    {invoice.isArchived ? (
                        <Button variant="secondary" onClick={onRestore}>Restore</Button>
                    ) : (
                        <Button variant="secondary" onClick={onArchive}>Archive</Button>
                    )}
                </div>
            </div>
            <div className="header-bottom grid-2">
                <div className="date-group">
                    <span className="date-label">Issue Date</span>
                    <span className="date-value">{format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="date-group text-right">
                    <span className="date-label">Due Date</span>
                    <span className="date-value text-strong">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</span>
                </div>
            </div>
        </Card>
    );
};

export default InvoiceHeader;
