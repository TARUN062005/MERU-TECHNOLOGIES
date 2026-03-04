const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['success', 'error', 'info'], default: 'info' },
  relatedInvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  isRead: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }
});
module.exports = mongoose.model('Notification', notificationSchema);
