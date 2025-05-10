import express from 'express';
import User from '../models/User.js';
import { auth, isUser } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Update user profile
router.put('/profile', auth, isUser, async (req, res) => {
  try {
    const { password, newPassword, ...updates } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Handle password update
    if (newPassword) {
      // Verify current password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }
    
    // Update other fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });
    
    await user.save();
    
    // Return updated user data without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;