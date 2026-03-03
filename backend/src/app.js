const express = require('express');
const cors = require('cors');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const Notification = require('./models/Notification');

app.use('/api/invoices', invoiceRoutes);

// Simple notification routes
app.get('/api/notifications', async (req, res) => {
    const notes = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json(notes);
});
app.post('/api/notifications', async (req, res) => {
    const note = await Notification.create(req.body);
    res.json(note);
});
app.post('/api/notifications/read', async (req, res) => {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true });
});

app.use((err, req, res, next) => {
    const status = err.message.includes('not found') ? 404 : 400;
    res.status(status).json({ message: err.message || 'Server Error' });
});

module.exports = app;
