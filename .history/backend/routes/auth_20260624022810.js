const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, address, nationalId, password, role, adminKey } = req.body;

    // Validate all required fields (now includes phone, address, nationalId)
    if (!name || !email || !phone || !address || !nationalId || !password) {
      return res.status(400).json({ message: 'All fields are required' });
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
      address,
      nationalId,
      password,          // will be hashed by the pre-save hook
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

// Login (unchanged, but you may want to include new fields in the response)
r

module.exports = router;