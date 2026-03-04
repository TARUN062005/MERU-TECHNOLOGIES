const express = require('express');
const cors = require('cors');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const Notification = require('./models/Notification');

const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);

// Simple notification routes
app.get('/api/notifications', protect, async (req, res) => {
    const notes = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json(notes);
});
app.post('/api/notifications', protect, async (req, res) => {
    const note = await Notification.create({ ...req.body, userId: req.user.id });
    res.json(note);
});
app.post('/api/notifications/read', protect, async (req, res) => {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
    res.json({ success: true });
});

app.use((err, req, res, next) => {
    const status = err.message.includes('not found') ? 404 : 400;
    res.status(status).json({ message: err.message || 'Server Error' });
});

module.exports = app;
