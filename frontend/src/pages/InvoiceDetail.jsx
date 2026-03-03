import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoice } from '../hooks/useInvoice';
import { useNotification } from '../context/NotificationContext';

import InvoiceHeader from '../components/invoice/InvoiceHeader';
import InvoiceLineItems from '../components/invoice/InvoiceLineItems';
import InvoiceTotals from '../components/invoice/InvoiceTotals';
import PaymentList from '../components/invoice/PaymentList';
import AddPaymentModal from '../components/invoice/AddPaymentModal';
import AddLineItemModal from '../components/invoice/AddLineItemModal';
import SectionContainer from '../components/common/SectionContainer';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const InvoiceDetail = () => {
    const { id } = useParams();
    const { invoice, loading, error, addLineItem, addPayment, archive, restore } = useInvoice(id);
    const { addNotification } = useNotification();

    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [lineModalOpen, setLineModalOpen] = useState(false);

    if (loading) return <Loader />;
    if (error) return <EmptyState message={error} />;
    if (!invoice) return <EmptyState message="Invoice not found" />;

    const isPaid = invoice.status === 'PAID';

    const handleArchive = async () => {
        await archive();
        addNotification('Invoice archived');
    };

    const handleRestore = async () => {
        await restore();
        addNotification('Invoice restored');
    };

    const handleAddPayment = async (amt) => {
        await addPayment(amt);
        addNotification('Payment recorded successfully!');
    };

    const handleAddLine = async (data) => {
        await addLineItem(data);
        addNotification('Line item added!');
    };

    const handleDownload = () => {
        // Since we import jsPDF, let's create a dynamic invoice doc
        import('jspdf').then(({ default: jsPDF }) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF();

                doc.setFontSize(22);
                doc.text('INVOICE', 14, 20);

                doc.setFontSize(12);
                doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 30);
                doc.text(`Customer: ${invoice.customerName}`, 14, 38);
                doc.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 14, 46);
                doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 14, 54);

                const tableColumn = ["Description", "Quantity", "Unit Price", "Total"];
                const tableRows = [];

                invoice.lineItems.forEach(item => {
                    tableRows.push([
                        item.description,
                        item.quantity,
                        item.unitPrice,
                        item.lineTotal
                    ]);
                });

                doc.autoTable({
                    startY: 65,
                    head: [tableColumn],
                    body: tableRows,
                });

                const finalY = doc.lastAutoTable.finalY || 65;
                doc.text(`Total amount: ${invoice.total}`, 14, finalY + 15);
                doc.text(`Amount paid: ${invoice.amountPaid}`, 14, finalY + 23);
                doc.text(`Balance Due: ${invoice.balanceDue}`, 14, finalY + 31);

                doc.save(`invoice_${invoice.invoiceNumber}.pdf`);
            });
        });
    };

    return (
        <div className="page-fade-in mt-20">
            <InvoiceHeader invoice={invoice} onArchive={handleArchive} onRestore={handleRestore} onDownload={handleDownload} />

            <div className="grid-layout">
                <div className="main-content">
                    <SectionContainer title="Line Items">
                        <div className="flex-end mb-10">
                            <Button onClick={() => setLineModalOpen(true)} disabled={isPaid || invoice.isArchived} variant="secondary">Add Line Item</Button>
                        </div>
                        <InvoiceLineItems items={invoice.lineItems} currency={invoice.currency} />
                    </SectionContainer>

                    <SectionContainer title="Payments">
                        <div className="flex-between mb-15">
                            <span>Payment History</span>
                            <Button
                                onClick={() => setPaymentModalOpen(true)}
                                disabled={isPaid || invoice.isArchived}
                            >
                                Add Payment
                            </Button>
                        </div>
                        <PaymentList payments={invoice.payments} currency={invoice.currency} />
                    </SectionContainer>
                </div>

                <div className="sidebar">
                    <SectionContainer title="Summary">
                        <InvoiceTotals
                            total={invoice.total}
                            amountPaid={invoice.amountPaid}
                            balanceDue={invoice.balanceDue}
                            currency={invoice.currency}
                        />
                    </SectionContainer>
                </div>
            </div>

            <AddPaymentModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                balanceDue={invoice.balanceDue}
                onSubmit={handleAddPayment}
            />

            <AddLineItemModal
                isOpen={lineModalOpen}
                onClose={() => setLineModalOpen(false)}
                onSubmit={handleAddLine}
            />
        </div>
    );
};

export default InvoiceDetail;
