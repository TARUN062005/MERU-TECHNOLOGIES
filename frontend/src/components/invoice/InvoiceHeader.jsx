import React from 'react';
import { format } from 'date-fns';
import Badge from '../common/Badge';
import Card from '../common/Card';
import Button from '../common/Button';
import { currencies } from '../currency/CurrencySelector';
import { Archive, RotateCcw, Download, Send, Trash2 } from 'lucide-react';

const InvoiceHeader = ({ invoice, onArchive, onRestore, onDownload, onSend, onDelete }) => {
    const currencyObj = currencies.find(c => c.code === (invoice.currency || 'USD'));

    return (
        <Card className="invoice-header mb-20 section-container">
            <div className="header-top flex-between border-bottom pb-20 mb-20">
                <div>
                    <h1 className="invoice-title flex-align-center text-large text-strong">
                        Invoice #{invoice.invoiceNumber}
                        {invoice.isArchived && <span className="ml-10 text-muted text-small">(Archived)</span>}
                    </h1>
                </div>
                <div className="flex-end gap-10">
                    {currencyObj && (
                        <div className="flex-align-center gap-10 bg-color p-10 mr-10" style={{ background: 'var(--bg-color)', padding: '6px 12px', borderRadius: '8px', fontWeight: 500 }}>
                            <img src={currencyObj.flag} alt="flag" width="20" height="14" />
                            {currencyObj.code}
                        </div>
                    )}
                    <Badge status={invoice.status} isArchived={invoice.isArchived} />
                    <Button variant="secondary" onClick={onDownload}><Download size={16} /> Download</Button>
                    {!invoice.isArchived && (
                        <>
                            <Button variant="primary" onClick={onSend}><Send size={16} /> Send Email</Button>
                            <Button variant="secondary" onClick={onDelete} style={{ color: 'var(--error)' }}><Trash2 size={16} /> Delete</Button>
                        </>
                    )}
                    {invoice.isArchived ? (
                        <Button variant="secondary" onClick={onRestore}><RotateCcw size={16} /> Restore</Button>
                    ) : (
                        <Button variant="secondary" onClick={onArchive}><Archive size={16} /> Archive</Button>
                    )}
                </div>
            </div>

            <div className="header-bottom grid-2">
                <div>
                    <div className="text-muted text-small text-strong mb-10">CUSTOMER</div>
                    <div className="text-strong">{invoice.customerName}</div>
                    <div className="text-muted text-small mt-10" style={{ whiteSpace: 'pre-wrap' }}>
                        {invoice.address || 'No address provided'}
                    </div>
                </div>
                <div className="text-right">
                    <div className="grid-2" style={{ gap: '0.5rem', textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex-justify-end" style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
                            <span className="text-muted">Issue Date:</span>
                            <span className="text-strong">{format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex-justify-end" style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
                            <span className="text-muted">Due Date:</span>
                            <span className="text-strong text-error">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default InvoiceHeader;
