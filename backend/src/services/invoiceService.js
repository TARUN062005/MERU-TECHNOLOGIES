const Invoice = require('../models/Invoice');
const InvoiceLine = require('../models/InvoiceLine');
const Payment = require('../models/Payment');

const getInvoiceDetails = async (id) => {
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) throw new Error('Invoice not found');

    const lineItems = await InvoiceLine.find({ invoiceId: id }).lean();
    const payments = await Payment.find({ invoiceId: id }).lean();

    return { ...invoice, lineItems, payments };
};

const addPayment = async (id, amount) => {
    if (amount <= 0) throw new Error('Amount must be greater than 0');

    const invoice = await Invoice.findById(id);
    if (!invoice) throw new Error('Invoice not found');
    if (amount > invoice.balanceDue) throw new Error('Overpayment not allowed');

    const payment = new Payment({ invoiceId: id, amount });
    await payment.save();

    invoice.amountPaid += amount;
    invoice.balanceDue = invoice.total - invoice.amountPaid;

    if (invoice.balanceDue === 0) {
        invoice.status = 'PAID';
    }

    await invoice.save();
    return getInvoiceDetails(id);
};

const archiveInvoice = async (id) => {
    const invoice = await Invoice.findByIdAndUpdate(id, { isArchived: true }, { new: true });
    if (!invoice) throw new Error('Invoice not found');
    return invoice;
};

const restoreInvoice = async (id) => {
    const invoice = await Invoice.findByIdAndUpdate(id, { isArchived: false }, { new: true });
    if (!invoice) throw new Error('Invoice not found');
    return invoice;
};

module.exports = {
    getInvoiceDetails,
    addPayment,
    archiveInvoice,
    restoreInvoice
};
