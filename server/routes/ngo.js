import express from 'express';
import NGO from '../models/NGO.js';
import { auth, isNGO } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Update NGO profile
router.put('/profile', auth, isNGO, async (req, res) => {
  try {
    const { password, newPassword, ...updates } = req.body;
    const ngo = await NGO.findById(req.user.id);
    
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    // Handle password update
    if (newPassword) {
      // Verify current password
      const isMatch = await ngo.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      ngo.password = hashedPassword;
    }
    
    // Update other fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        ngo[key] = updates[key];
      }
    });
    
    await ngo.save();
    
    // Return updated NGO data without password
    const updatedNGO = await NGO.findById(req.user.id).select('-password');
    res.json(updatedNGO);
  } catch (error) {
    console.error('Update NGO profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit verification request
router.post('/verify', auth, isNGO, async (req, res) => {
  try {
    const { governmentId } = req.body;
    
    if (!governmentId) {
      return res.status(400).json({ message: 'Government ID is required' });
    }
    
    const ngo = await NGO.findById(req.user.id);
    
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    // Update verification status
    ngo.governmentId = governmentId;
    ngo.verificationStatus = 'pending';
    
    await ngo.save();
    
    res.json({
      message: 'Verification request submitted successfully',
      verificationStatus: ngo.verificationStatus
    });
  } catch (error) {
    console.error('NGO verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;