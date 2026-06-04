const express = require('express');
const router  = express.Router();

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect }         = require('../middleware/authMiddleware');
const { authorizeRoles }  = require('../middleware/roleMiddleware');

// Public
router.post('/login', loginUser);

// Admin only — only admins can create new staff accounts
router.post('/register', protect, authorizeRoles('admin'), registerUser);

// Private
router.get('/me', protect, getMe);

module.exports = router;
