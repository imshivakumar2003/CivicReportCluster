const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, address, nationalId, password, confirmPassword, role, adminKey } = req.body;

    // Basic required fields
    if (!name || !email || !phone || !nationalId || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate address object and its subfields
    if (!address || typeof address !== 'object') {
      return res.status(400).json({ message: 'Address is required and must be an object' });
    }
    const { line, city, district, state, pincode } = address;
    if (!line || !city || !district || !state || !pincode) {
      return res.status(400).json({ message: 'All address fields (line, city, district, state, pincode) are required' });
    }

    // Password confirmation check (already done on frontend, but double-check)
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists by email or national ID
    const existingUser = await User.findOne({ $or: [{ email }, { nationalId }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'National ID';
      return res.status(400).json({ message: `${field} already registered` });
    }

    // Determine role (admin creation only with correct admin key)
    const userRole = (role === 'admin' && adminKey === 'CIVIC_ADMIN_2024') ? 'admin' : 'user';

    // Create user with all fields
    const user = await User.create({
      name,
      email,
      phone,
      address: { line, city, district, state, pincode },
      nationalId,
      password,   // will be hashed by the pre-save hook
      role: userRole
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        nationalId: user.nationalId,
        role: user.role
      }
    });
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        nationalId: user.nationalId,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;