const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, googleLogin, getProfile, resendVerification, changePassword, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyEmail);
router.post('/google', googleLogin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/resend-verification', protect, resendVerification);
router.post('/change-password', protect, changePassword);

module.exports = router;
