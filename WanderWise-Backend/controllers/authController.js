// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- SIGN UP LOGIC ---
exports.signup = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the new user in the database
    const newUser = await User.create({
      email: email,
      password_hash: hashedPassword, // Storing the hashed password
      full_name: full_name,
      role: 'USER' // Default role
    });

    // 4. Send a success response
    res.status(201).json({ 
      message: 'User created successfully!',
      userId: newUser.user_id 
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// --- LOGIN LOGIC ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 2. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 3. Create a JWT Token
    // 'secret_key_123' should ideally be in a .env file, but this works for now.
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      'secret_key_123', 
      { expiresIn: '2h' }
    );

    // 4. Send back the token and user info (excluding the password)
    res.json({
      message: 'Login successful!',
      token: token,
      user: {
        id: user.user_id,
        name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};