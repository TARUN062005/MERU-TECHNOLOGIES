const express = require('express');
const cors = require('cors');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/invoices', invoiceRoutes);

app.use((err, req, res, next) => {
    const status = err.message.includes('not found') ? 404 : 400;
    res.status(status).json({ message: err.message || 'Server Error' });
});

module.exports = app;
