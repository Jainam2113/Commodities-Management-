// backend/src/controllers/authController.js
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const authController = {
    // Register user
    register: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password, role = 'store_keeper' } = req.body;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const user = await User.create({ email, password, role });

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('Validation errors:', errors.array());
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            console.log('Login attempt for:', email);

            const user = await User.scope('withPassword').findOne({ where: { email } });
            if (!user) {
                console.log('User not found:', email);
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            console.log('User found, validating password...');
            const isValidPassword = await user.validatePassword(password);
            console.log('Password validation result:', isValidPassword);

            if (!isValidPassword) {
                console.log('Invalid password for:', email);
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            console.log('Login successful for:', email);

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get current user
    getProfile: async (req, res) => {
        try {
            res.json({
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role
                }
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Logout user
    logout: (req, res) => {
        res.json({ message: 'Logged out successfully' });
    }
};

module.exports = authController;