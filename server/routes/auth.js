import express from 'express';
import jwt from 'jsonwebtoken';
import NGO from '../models/NGO.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Register NGO
router.post('/ngo/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if NGO already exists
    const existingNGO = await NGO.findOne({ email });
    if (existingNGO) {
      return res.status(400).json({ message: 'NGO with this email already exists' });
    }
    
    // Create new NGO
    const ngo = new NGO({
      name,
      email,
      password
    });
    
    await ngo.save();
    
    // Create token
    const token = jwt.sign(
      { id: ngo._id, role: 'ngo' },
      process.env.JWT_SECRET || 'default_secret_change_in_production',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        isVerified: ngo.isVerified,
        verificationStatus: ngo.verificationStatus
      }
    });
  } catch (error) {
    console.error('NGO registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login NGO
router.post('/ngo/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if NGO exists
    const ngo = await NGO.findOne({ email });
    if (!ngo) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await ngo.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: ngo._id, role: 'ngo' },
      process.env.JWT_SECRET || 'default_secret_change_in_production',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        isVerified: ngo.isVerified,
        verificationStatus: ngo.verificationStatus
      }
    });
  } catch (error) {
    console.error('NGO login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register User
router.post('/user/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password
    });
    
    await user.save();
    
    // Create token
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET || 'default_secret_change_in_production',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET || 'default_secret_change_in_production',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const { id, role } = req.user;
    
    if (role === 'ngo') {
      const ngo = await NGO.findById(id).select('-password');
      if (!ngo) {
        return res.status(404).json({ message: 'NGO not found' });
      }
      
      return res.json({
        role: 'ngo',
        user: ngo
      });
    } else if (role === 'user') {
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.json({
        role: 'user',
        user
      });
    }
    
    res.status(400).json({ message: 'Invalid user role' });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;