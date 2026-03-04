const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // SSL
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.transporter.verify().then(() => {
    console.log('📧 Nodemailer connected successfully to email server');
}).catch((error) => {
    console.error('📧 Nodemailer connection error:', error);
});
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supers3cr3tJWT', {
        expiresIn: '30d'
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = Math.random().toString(36).substring(2, 15);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken
        });

        const verificationUrl = `http://localhost:5173/settings`; // Pointing to settings to simulate

        try {
            await exports.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Please verify your email - FinDash',
                html: `<p>Welcome to FinDash!</p><p>Your verification token is: <strong>${verificationToken}</strong></p><p>Go to your app settings to verify.</p>`
            });
        } catch (mailError) {
            console.error('Failed to send verification email:', mailError);
        }

        res.status(201).json({
            message: 'Registration successful! Verification email sent.',
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                googleId: user.googleId,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ verificationToken: token });

        if (!user) return res.status(400).json({ message: 'Invalid verification token' });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, sub, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId: sub,
                avatarUrl: picture,
                isVerified: true // Google logins are auto-verified
            });
        } else {
            if (!user.isVerified) user.isVerified = true;
            if (picture && !user.avatarUrl) user.avatarUrl = picture;
            await user.save();
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            isVerified: user.isVerified,
            googleId: user.googleId,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Google login failed: ' + error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resendVerification = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User is already verified' });

        const verificationToken = Math.random().toString(36).substring(2, 15);
        user.verificationToken = verificationToken;
        await user.save();

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Resend Verification - FinDash',
                html: `<p>Your new verification token is: <strong>${verificationToken}</strong></p><p>Go to your app settings to verify.</p>`
            });
        } catch (mailError) {
            console.error('Failed to send verification email:', mailError);
        }

        res.json({ message: 'Verification email resent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.password && user.googleId) {
            return res.status(400).json({ message: 'Google users cannot change password like this.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, avatarUrl } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name || user.name;
        user.phone = phone !== undefined ? phone : user.phone;
        user.avatarUrl = avatarUrl !== undefined ? avatarUrl : user.avatarUrl;

        await user.save();

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            isVerified: user.isVerified,
            googleId: user.googleId,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
