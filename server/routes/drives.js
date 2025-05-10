import express from 'express';
import Drive from '../models/Drive.js';
import DriveRegistration from '../models/DriveRegistration.js';
import NGO from '../models/NGO.js';
import { auth, isNGO, isUser } from '../middleware/auth.js';

const router = express.Router();

// Create a new drive (NGO only)
router.post('/', auth, isNGO, async (req, res) => {
  try {
    const { title, description, date, time, type, resourcesRequired, imageUrl, location } = req.body;
    
    const drive = new Drive({
      title,
      description,
      date,
      time,
      type,
      resourcesRequired,
      imageUrl,
      location,
      ngoId: req.user.id
    });
    
    await drive.save();
    res.status(201).json(drive);
  } catch (error) {
    console.error('Create drive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all drives created by the logged-in NGO
router.get('/my-drives', auth, isNGO, async (req, res) => {
  try {
    const drives = await Drive.find({ ngoId: req.user.id }).sort({ createdAt: -1 });
    
    // Get registrations count for each drive
    const drivesWithCounts = await Promise.all(
      drives.map(async (drive) => {
        const count = await DriveRegistration.countDocuments({ driveId: drive._id });
        return { ...drive.toObject(), participantsCount: count };
      })
    );
    
    res.json(drivesWithCounts);
  } catch (error) {
    console.error('Get my drives error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all upcoming drives
router.get('/upcoming', auth, async (req, res) => {
  try {
    const now = new Date();
    const drives = await Drive.find({
      date: { $gte: now },
      status: 'active'
    }).sort({ date: 1 }).limit(20);
    
    // Add NGO names to the drives
    const drivesWithNGONames = await Promise.all(
      drives.map(async (drive) => {
        const ngo = await NGO.findById(drive.ngoId);
        return {
          ...drive.toObject(),
          ngoName: ngo ? ngo.name : 'Unknown Organization'
        };
      })
    );
    
    res.json(drivesWithNGONames);
  } catch (error) {
    console.error('Get upcoming drives error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for a drive (User only)
router.post('/register/:id', auth, isUser, async (req, res) => {
  try {
    const driveId = req.params.id;
    
    // Check if drive exists
    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }
    
    // Check if drive is active
    if (drive.status !== 'active') {
      return res.status(400).json({ message: 'This drive is no longer active' });
    }
    
    // Check if user is already registered
    const existingRegistration = await DriveRegistration.findOne({
      driveId,
      userId: req.user.id
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this drive' });
    }
    
    // Create registration
    const registration = new DriveRegistration({
      driveId,
      userId: req.user.id
    });
    
    await registration.save();
    
    // Get NGO name for the response
    const ngo = await NGO.findById(drive.ngoId);
    
    // Return registration with drive details
    const result = {
      ...registration.toObject(),
      drive: {
        ...drive.toObject(),
        ngoName: ngo ? ngo.name : 'Unknown Organization'
      }
    };
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Register for drive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's drive registrations
router.get('/my-registrations', auth, isUser, async (req, res) => {
  try {
    const registrations = await DriveRegistration.find({ userId: req.user.id })
      .sort({ registrationDate: -1 });
    
    // Add drive details to registrations
    const registrationsWithDrives = await Promise.all(
      registrations.map(async (registration) => {
        const drive = await Drive.findById(registration.driveId);
        if (!drive) {
          return null; // Drive might have been deleted
        }
        
        // Get NGO name
        const ngo = await NGO.findById(drive.ngoId);
        
        return {
          ...registration.toObject(),
          drive: {
            ...drive.toObject(),
            ngoName: ngo ? ngo.name : 'Unknown Organization'
          }
        };
      })
    );
    
    // Filter out any null values (deleted drives)
    const validRegistrations = registrationsWithDrives.filter(reg => reg !== null);
    
    res.json(validRegistrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update drive status
router.put('/:id', auth, isNGO, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Find drive and check ownership
    const drive = await Drive.findOne({
      _id: req.params.id,
      ngoId: req.user.id
    });
    
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found or not authorized' });
    }
    
    // Update status
    drive.status = status;
    await drive.save();
    
    res.json(drive);
  } catch (error) {
    console.error('Update drive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete drive
router.delete('/:id', auth, isNGO, async (req, res) => {
  try {
    // Find drive and check ownership
    const drive = await Drive.findOne({
      _id: req.params.id,
      ngoId: req.user.id
    });
    
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found or not authorized' });
    }
    
    // Delete all registrations for this drive
    await DriveRegistration.deleteMany({ driveId: drive._id });
    
    // Delete the drive
    await Drive.findByIdAndDelete(drive._id);
    
    res.json({ message: 'Drive deleted successfully' });
  } catch (error) {
    console.error('Delete drive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;