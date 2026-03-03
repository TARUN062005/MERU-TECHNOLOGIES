const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    issueDate: { type: Date },
    dueDate: { type: Date },
    status: { type: String, enum: ['DRAFT', 'PAID'], default: 'DRAFT' },
    total: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
