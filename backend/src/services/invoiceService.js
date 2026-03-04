const Invoice = require('../models/Invoice');
const InvoiceLine = require('../models/InvoiceLine');
const Payment = require('../models/Payment');
const { transporter } = require('../controllers/authController');

const getInvoiceResponse = async (id, userId) => {
    const invoice = await Invoice.findOne({ _id: id, userId }).lean();
    if (!invoice) throw new Error('Invoice not found');
    const lineItems = await InvoiceLine.find({ invoiceId: id }).lean();
    const payments = await Payment.find({ invoiceId: id }).lean();
    return { ...invoice, lineItems, payments };
};

const getAllInvoices = async (query = {}, userId) => {
    const filter = { userId };
    if (query.status && query.status !== 'All') {
        filter.status = query.status.toUpperCase();
    }
    if (query.search) {
        filter.$or = [
            { invoiceNumber: { $regex: query.search, $options: 'i' } },
            { customerName: { $regex: query.search, $options: 'i' } }
        ];
    }
    const invoices = await Invoice.find(filter).sort({ issueDate: -1 }).lean();
    return invoices;
};

const createInvoice = async (data, userId) => {
    const { invoiceNumber, customerName, customerEmail, issueDate, dueDate, initialLines, address, currency } = data;
    if (!invoiceNumber || !customerName || !issueDate || !dueDate) {
        throw new Error('Missing required fields');
    }

    const invoice = new Invoice({ invoiceNumber, customerName, customerEmail, issueDate, dueDate, address, currency, userId });
    await invoice.save();

    if (initialLines && initialLines.length > 0) {
        let total = 0;
        const linesToInsert = initialLines.map(line => {
            if (line.quantity < 0 || line.unitPrice < 0) throw new Error('Negative values not allowed');
            const lineTotal = line.quantity * line.unitPrice;
            total += lineTotal;
            return {
                invoiceId: invoice._id,
                description: line.description,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                lineTotal
            };
        });

        await InvoiceLine.insertMany(linesToInsert);
        invoice.total = total;
        invoice.balanceDue = total;
        await invoice.save();
    }

    if (customerEmail && !data.isDraft) {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: customerEmail,
                subject: `New Invoice from FinDash: ${invoiceNumber}`,
                html: `
                    <h2>Invoice ${invoiceNumber}</h2>
                    <p>Dear ${customerName},</p>
                    <p>A new invoice has been generated for you.</p>
                    <p><strong>Total Amount:</strong> ${invoice.total} ${currency}</p>
                    <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
                    <p>Thank you for your business!</p>
                `
            });
            console.log(`📧 Invoice ${invoiceNumber} sent to ${customerEmail}`);
        } catch (error) {
            console.error('📧 Failed to send invoice email:', error);
        }
    }

    return getInvoiceResponse(invoice._id, userId);
};

const getInvoice = async (id, userId) => {
    return getInvoiceResponse(id, userId);
};

const addLineItem = async (id, data, userId) => {
    const invoice = await Invoice.findOne({ _id: id, userId });
    if (!invoice) throw new Error('Invoice not found');

    const { description, quantity, unitPrice } = data;
    if (!description || quantity == null || unitPrice == null) throw new Error('Missing required fields');
    if (quantity < 0 || unitPrice < 0) throw new Error('Negative values not allowed');

    const lineTotal = quantity * unitPrice;
    const lineItem = new InvoiceLine({ invoiceId: id, description, quantity, unitPrice, lineTotal });
    await lineItem.save();

    const lines = await InvoiceLine.find({ invoiceId: id });
    const total = lines.reduce((acc, curr) => acc + curr.lineTotal, 0);

    invoice.total = total;
    invoice.balanceDue = total - invoice.amountPaid;
    if (invoice.balanceDue === 0 && invoice.total > 0) invoice.status = 'PAID';
    if (invoice.balanceDue > 0) invoice.status = 'DRAFT';
    await invoice.save();

    return getInvoiceResponse(id, userId);
};

const addPayment = async (id, amount, userId) => {
    if (amount <= 0) throw new Error('Payment amount must be greater than zero');
    const invoice = await Invoice.findOne({ _id: id, userId });
    if (!invoice) throw new Error('Invoice not found');

    if (amount > invoice.balanceDue) throw new Error('Payment exceeds balance due');

    const payment = new Payment({ invoiceId: id, amount });
    await payment.save();

    invoice.amountPaid += amount;
    invoice.balanceDue = invoice.total - invoice.amountPaid;
    if (invoice.balanceDue === 0) invoice.status = 'PAID';
    await invoice.save();

    return getInvoiceResponse(id, userId);
};

const archiveInvoice = async (id, userId) => {
    const invoice = await Invoice.findOneAndUpdate({ _id: id, userId }, { isArchived: true }, { new: true });
    if (!invoice) throw new Error('Invoice not found');
    return getInvoiceResponse(id, userId);
};

const restoreInvoice = async (id, userId) => {
    const invoice = await Invoice.findOneAndUpdate({ _id: id, userId }, { isArchived: false }, { new: true });
    if (!invoice) throw new Error('Invoice not found');
    return getInvoiceResponse(id, userId);
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoice,
    addLineItem,
    addPayment,
    archiveInvoice,
    restoreInvoice
};
