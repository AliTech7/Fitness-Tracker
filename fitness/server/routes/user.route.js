const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticate } = require('../config/jwt.config');

// Public routes (no authentication required)
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes (authentication required)
router.use(authenticate); // Apply authentication middleware to all routes below

// Get current user profile
router.get('/current', UserController.getCurrentUser);

// Update user profile
router.put('/profile', UserController.updateProfile);

// Change password
router.put('/password', UserController.changePassword);

// Logout (optional - can be handled client-side)
router.post('/logout', UserController.logout);

module.exports = router; 