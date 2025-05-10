import express from 'express';
import Resource from '../models/Resource.js';

const router = express.Router();

// Webhook endpoint for WhatsApp/Telegram messages
router.post('/message', async (req, res) => {
  try {
    const { message, sender, source } = req.body;
    
    // Basic validation
    if (!message || !sender) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Extract donation information from message using simple parsing
    // In a real implementation, you might use NLP or a more robust parsing strategy
    const donationMatch = message.match(/Donation:?\s*(.+?)(?:\n|$)/i);
    const locationMatch = message.match(/Location:?\s*(.+?)(?:\n|$)/i);
    const contactMatch = message.match(/Contact:?\s*(.+?)(?:\n|$)/i);
    
    if (!donationMatch || !locationMatch) {
      return res.status(400).json({ 
        message: 'Could not parse donation information', 
        help: 'Please format your message like: "Donation: [items]\nLocation: [address]\nContact: [name and phone]"'
      });
    }
    
    // Create mock coordinates (in a real implementation, you would use geocoding)
    const mockCoordinates = {
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1
    };
    
    // Create new resource
    const resource = new Resource({
      title: `Donation: ${donationMatch[1].trim()}`,
      description: message,
      location: {
        lat: mockCoordinates.lat,
        lng: mockCoordinates.lng,
        address: locationMatch[1].trim()
      },
      contactInfo: contactMatch ? contactMatch[1].trim() : sender,
      donorName: sender.split(',')[0] // Use first part of sender name
    });
    
    await resource.save();
    
    // In a real implementation, you might want to send a confirmation message back to the user
    
    res.status(201).json({
      message: 'Donation received successfully',
      resource: resource
    });
  } catch (error) {
    console.error('Webhook message processing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;