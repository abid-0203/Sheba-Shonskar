    // backend/routes/auth.js
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const User = require('../models/User'); // Path to your User model

    // @route   POST /api/auth/register
    // @desc    Register user
    // @access  Public
    router.post('/register', async (req, res) => {
      const {
        firstName,
        lastName,
        email,
        phone,
        altPhone,
        ps,
        nid,
        birthdate,
        age,
        presentAddress,
        permanentAddress,
        password,
      } = req.body;

      try {
        // Check if user with email or NID already exists
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ msg: 'User with this email already exists' });
        }
        user = await User.findOne({ nid });
        if (user) {
          return res.status(400).json({ msg: 'User with this NID already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
          firstName,
          lastName,
          email,
          phone,
          altPhone,
          ps,
          nid,
          birthdate,
          age,
          presentAddress,
          permanentAddress,
          password: hashedPassword,
          role: 'citizen', // Default role for registration
        });

        await user.save();

        // Generate JWT token
        const payload = {
          user: {
            id: user.id,
            role: user.role,
            firstName: user.firstName, // Include first name for convenience
            lastName: user.lastName,   // Include last name for convenience
          },
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1h' }, // Token expires in 1 hour
          (err, token) => {
            if (err) throw err;
            res.status(201).json({ msg: 'Registration successful', token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
          }
        );

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });

    // @route   POST /api/auth/login
    // @desc    Authenticate user & get token
    // @access  Public
    router.post('/login', async (req, res) => {
      const { email, password } = req.body;

      try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Generate JWT token
        const payload = {
          user: {
            id: user.id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
          (err, token) => {
            if (err) throw err;
            res.json({ msg: 'Login successful', token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
          }
        );

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });

    module.exports = router;
    