import express from 'express';
import Resource from '../models/Resource.js';
import { auth, isNGO } from '../middleware/auth.js';

const router = express.Router();

// Get all available resources
router.get('/', auth, isNGO, async (req, res) => {
  try {
    const resources = await Resource.find({ status: 'available' }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get claimed resources for the NGO
router.get('/claimed', auth, isNGO, async (req, res) => {
  try {
    const resources = await Resource.find({
      claimedBy: req.user.id,
      status: { $in: ['claimed', 'collected'] }
    }).sort({ claimedAt: -1 });
    
    res.json(resources);
  } catch (error) {
    console.error('Get claimed resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim a resource
router.post('/claim/:id', auth, isNGO, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    if (resource.status !== 'available') {
      return res.status(400).json({ message: 'Resource is already claimed' });
    }
    
    // Update resource status
    resource.status = 'claimed';
    resource.claimedBy = req.user.id;
    resource.claimedAt = new Date();
    
    await resource.save();
    
    res.json(resource);
  } catch (error) {
    console.error('Claim resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark resource as collected
router.post('/collect/:id', auth, isNGO, async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      claimedBy: req.user.id
    });
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or not claimed by you' });
    }
    
    if (resource.status === 'collected') {
      return res.status(400).json({ message: 'Resource is already marked as collected' });
    }
    
    // Update resource status
    resource.status = 'collected';
    await resource.save();
    
    res.json(resource);
  } catch (error) {
    console.error('Collect resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;