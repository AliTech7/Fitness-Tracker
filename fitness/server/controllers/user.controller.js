const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../config/jwt.config');

module.exports = {
    // Register a new user
    register: async (req, res) => {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ 
                    message: "Registration failed",
                    errors: { email: "Email already exists" }
                });
            }

            // Create new user
            const user = await User.create(req.body);
            
            // Generate JWT token
            const token = generateToken(user);
            
            // Send response without password
            const { password, ...userWithoutPassword } = user.toObject();
            res.status(201).json({
                message: "Registration successful",
                user: userWithoutPassword,
                token
            });
        } catch (err) {
            res.status(400).json({
                message: "Registration failed",
                errors: err.errors ? Object.keys(err.errors).reduce((acc, key) => {
                    acc[key] = err.errors[key].message;
                    return acc;
                }, {}) : err.message
            });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            // Find user by email
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({
                    message: "Login failed",
                    errors: { email: "Email not found" }
                });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(req.body.password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({
                    message: "Login failed",
                    errors: { password: "Invalid password" }
                });
            }

            // Generate JWT token
            const token = generateToken(user);
            
            // Send response without password
            const { password, ...userWithoutPassword } = user.toObject();
            res.json({
                message: "Login successful",
                user: userWithoutPassword,
                token
            });
        } catch (err) {
            res.status(400).json({
                message: "Login failed",
                error: err.message
            });
        }
    },

    // Get current user
    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password');
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        } catch (err) {
            res.status(400).json({
                message: "Error fetching user",
                error: err.message
            });
        }
    },

    // Update user profile
    updateProfile: async (req, res) => {
        try {
            // Don't allow password update through this endpoint
            const { password, ...updateData } = req.body;
            
            const user = await User.findByIdAndUpdate(
                req.user._id,
                updateData,
                { 
                    new: true,
                    runValidators: true 
                }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({
                message: "Profile updated successfully",
                user
            });
        } catch (err) {
            res.status(400).json({
                message: "Error updating profile",
                errors: err.errors ? Object.keys(err.errors).reduce((acc, key) => {
                    acc[key] = err.errors[key].message;
                    return acc;
                }, {}) : err.message
            });
        }
    },

    // Change password
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;

            // Find user
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Verify current password
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(400).json({
                    message: "Password change failed",
                    errors: { currentPassword: "Current password is incorrect" }
                });
            }

            // Update password
            user.password = newPassword;
            await user.save();

            res.json({ message: "Password changed successfully" });
        } catch (err) {
            res.status(400).json({
                message: "Error changing password",
                error: err.message
            });
        }
    },

    // Logout (if needed - typically handled client-side)
    logout: (req, res) => {
        res.json({ message: "Logged out successfully" });
    }
}; 