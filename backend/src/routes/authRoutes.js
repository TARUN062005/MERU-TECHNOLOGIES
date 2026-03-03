const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, googleLogin, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyEmail);
router.post('/google', googleLogin);
router.get('/profile', protect, getProfile);

module.exports = router;
