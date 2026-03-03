require('dotenv').config();
const mongoose = require('mongoose');
const Invoice = require('./src/models/Invoice');
const InvoiceLine = require('./src/models/InvoiceLine');
const connectDB = require('./src/config/db');

const seedDB = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const id = new mongoose.Types.ObjectId('65d1c25a58eeb29aa189be32');

        await Invoice.deleteMany({});
        await InvoiceLine.deleteMany({});

        const invoice = new Invoice({
            _id: id,
            invoiceNumber: 'INV-2026-001',
            customerName: 'Acme Corporation',
            issueDate: new Date('2026-03-01'),
            dueDate: new Date('2026-04-01'),
            status: 'DRAFT',
            total: 3500,
            amountPaid: 0,
            balanceDue: 3500,
            isArchived: false
        });

        await invoice.save();

        const line1 = new InvoiceLine({
            invoiceId: id,
            description: 'Frontend Development Services',
            quantity: 40,
            unitPrice: 50
        });

        const line2 = new InvoiceLine({
            invoiceId: id,
            description: 'Backend API Integration',
            quantity: 30,
            unitPrice: 50
        });

        await line1.save();
        await line2.save();

        console.log('Seeded database with ID: 65d1c25a58eeb29aa189be32 successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed:', error);
        process.exit(1);
    }
};

seedDB();
