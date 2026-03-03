const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    address: { type: String, default: '' },
    status: { type: String, default: 'DRAFT' },
    currency: { type: String, default: 'USD' },
    total: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
