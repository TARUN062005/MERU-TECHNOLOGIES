import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInvoiceDetails } from '../hooks/useInvoices';
import InvoiceHeader from '../components/invoice/InvoiceHeader';
import InvoiceLineItems from '../components/invoice/InvoiceLineItems';
import InvoiceTotals from '../components/invoice/InvoiceTotals';
import PaymentList from '../components/payment/PaymentList';
import AddPaymentModal from '../components/payment/AddPaymentModal';
import SectionContainer from '../components/common/SectionContainer';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const InvoiceDetail = () => {
    const { id } = useParams();
    const { invoice, loading, error, submitPayment } = useInvoiceDetails(id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading) return <div className="page-center"><Loader /></div>;
    if (error) return <div className="page-center"><EmptyState message={error} /></div>;
    if (!invoice) return <div className="page-center"><EmptyState message="Invoice not found. Please connect the backend and seed data." /></div>;

    const isPaid = invoice.status === 'PAID';

    return (
        <div className="page-container">
            <InvoiceHeader invoice={invoice} />

            <div className="grid-layout">
                <div className="main-content">
                    <SectionContainer title="Line Items">
                        <InvoiceLineItems items={invoice.lineItems} />
                    </SectionContainer>

                    <SectionContainer title="Payments">
                        <div className="flex-between mb-15">
                            <span>Payment History</span>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                disabled={isPaid}
                            >
                                Add Payment
                            </Button>
                        </div>
                        <PaymentList payments={invoice.payments} />
                    </SectionContainer>
                </div>

                <div className="sidebar">
                    <SectionContainer title="Summary">
                        <InvoiceTotals
                            total={invoice.total}
                            amountPaid={invoice.amountPaid}
                            balanceDue={invoice.balanceDue}
                        />
                    </SectionContainer>
                </div>
            </div>

            <AddPaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                balanceDue={invoice.balanceDue}
                onSubmit={submitPayment}
            />
        </div>
    );
};

export default InvoiceDetail;
