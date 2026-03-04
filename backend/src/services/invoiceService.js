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

    const invoice = new Invoice({
        invoiceNumber,
        customerName,
        customerEmail,
        issueDate,
        dueDate,
        address,
        currency,
        userId,
        status: data.isDraft ? 'DRAFT' : 'PENDING'
    });
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

    let finalEmail = customerEmail;
    if (!finalEmail && address) {
        const match = address.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
        if (match) finalEmail = match[0];
    }

    if (finalEmail && !data.isDraft) {

        // Assemble Line Items HTML Table
        let lineItemsHtml = '';
        if (initialLines && initialLines.length > 0) {
            lineItemsHtml = `
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-family: sans-serif;">
                    <thead>
                        <tr style="border-bottom: 2px solid #ccc;">
                            <th style="text-align: left; padding: 10px;">Item Description</th>
                            <th style="text-align: right; padding: 10px;">Qty</th>
                            <th style="text-align: right; padding: 10px;">Price</th>
                            <th style="text-align: right; padding: 10px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${initialLines.map(line => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="text-align: left; padding: 10px;">${line.description}</td>
                                <td style="text-align: right; padding: 10px;">${line.quantity}</td>
                                <td style="text-align: right; padding: 10px;">${line.unitPrice}</td>
                                <td style="text-align: right; padding: 10px; font-weight: bold;">${(line.quantity * line.unitPrice).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: finalEmail,
                subject: `New Invoice from FinDash: ${invoiceNumber}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <div style="border-bottom: 1px solid #ccc; padding-bottom: 20px; margin-bottom: 20px;">
                            <h1 style="color: #4f46e5; margin-bottom: 5px;">INVOICE</h1>
                            <p style="color: #666; margin-top: 0;">#${invoiceNumber}</p>
                        </div>
                        <p>Dear ${customerName},</p>
                        <p>A new invoice has been generated for you.</p>
                        
                        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                            <div>
                                <p><strong>Issue Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
                                <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        ${lineItemsHtml}

                        <div style="text-align: right; margin-top: 20px; font-size: 1.1em;">
                            <p><strong>Total Amount:</strong> <span style="color: #4f46e5;">${invoice.total.toFixed(2)} ${currency}</span></p>
                        </div>
                        
                        <br/>
                        <p style="text-align: center; color: #666; font-size: 0.9em; border-top: 1px solid #eee; padding-top: 20px;">
                            Thank you for your business!
                        </p>
                    </div>
                `
            });
            console.log(`📧 Invoice ${invoiceNumber} sent to ${finalEmail}`);
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
    if (invoice.balanceDue === 0 && invoice.total > 0) {
        invoice.status = 'PAID';
    } else if (invoice.balanceDue > 0 && invoice.status !== 'PENDING') {
        invoice.status = 'DRAFT';
    }
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

const deleteInvoice = async (id, userId) => {
    const invoice = await Invoice.findOneAndDelete({ _id: id, userId });
    if (!invoice) throw new Error('Invoice not found');
    await InvoiceLine.deleteMany({ invoiceId: id });
    await Payment.deleteMany({ invoiceId: id });
    return { success: true };
};

const sendInvoice = async (id, userId) => {
    let invoice = await Invoice.findOne({ _id: id, userId });
    if (!invoice) throw new Error('Invoice not found');

    if (invoice.status === 'DRAFT') {
        invoice.status = 'PENDING';
        await invoice.save();
    }

    let finalEmail = invoice.customerEmail;
    if (!finalEmail && invoice.address) {
        const match = invoice.address.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
        if (match) finalEmail = match[0];
    }

    if (!finalEmail) {
        throw new Error('No valid email address found for this customer. Please include one in the address or create a new invoice.');
    }

    let lineItemsHtml = '';
    const lineItems = await InvoiceLine.find({ invoiceId: id }).lean();
    if (lineItems && lineItems.length > 0) {
        lineItemsHtml = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-family: sans-serif;">
                <thead>
                    <tr style="border-bottom: 2px solid #ccc;">
                        <th style="text-align: left; padding: 10px;">Item Description</th>
                        <th style="text-align: right; padding: 10px;">Qty</th>
                        <th style="text-align: right; padding: 10px;">Price</th>
                        <th style="text-align: right; padding: 10px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${lineItems.map(line => `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="text-align: left; padding: 10px;">${line.description}</td>
                            <td style="text-align: right; padding: 10px;">${line.quantity}</td>
                            <td style="text-align: right; padding: 10px;">${line.unitPrice}</td>
                            <td style="text-align: right; padding: 10px; font-weight: bold;">${(line.quantity * line.unitPrice).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: finalEmail,
            subject: `Invoice Update from FinDash: ${invoice.invoiceNumber}`,
            html: `
                 <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <div style="border-bottom: 1px solid #ccc; padding-bottom: 20px; margin-bottom: 20px;">
                        <h1 style="color: #4f46e5; margin-bottom: 5px;">INVOICE</h1>
                        <p style="color: #666; margin-top: 0;">#${invoice.invoiceNumber}</p>
                    </div>
                    <p>Dear ${invoice.customerName},</p>
                    <p>Here is the current status of your invoice.</p>
                    
                    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                        <div>
                            <p><strong>Issue Date:</strong> ${new Date(invoice.issueDate).toLocaleDateString()}</p>
                            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    ${lineItemsHtml}

                    <div style="text-align: right; margin-top: 20px; font-size: 1.1em;">
                        <p style="margin: 5px 0;"><strong>Subtotal:</strong> ${invoice.total.toFixed(2)} ${invoice.currency}</p>
                        <p style="margin: 5px 0; color: #2e7d32;"><strong>Amount Paid:</strong> - ${(invoice.amountPaid || 0).toFixed(2)} ${invoice.currency}</p>
                        <p style="margin: 15px 0 5px 0; font-size: 1.25em;"><strong>Balance Remaining:</strong> <span style="color: #d32f2f;">${(invoice.balanceDue || invoice.total).toFixed(2)} ${invoice.currency}</span></p>
                    </div>
                    
                    <br/>
                    <p style="text-align: center; color: #666; font-size: 0.9em; border-top: 1px solid #eee; padding-top: 20px;">
                        Thank you for your business!
                    </p>
                </div>
            `
        });
        console.log(`📧 Invoice Update ${invoice.invoiceNumber} sent to ${finalEmail}`);
    } catch (error) {
        console.error('📧 Failed to send invoice email:', error);
        throw new Error('Failed to send email via NodeMailer.');
    }

    return getInvoiceResponse(id, userId);
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoice,
    addLineItem,
    addPayment,
    archiveInvoice,
    restoreInvoice,
    deleteInvoice,
    sendInvoice
};
