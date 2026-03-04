const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if using Google login
    isVerified: { type: Boolean, default: false },
    googleId: { type: String },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    avatarUrl: { type: String },
    phone: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
