import mongoose from 'mongoose';

const DriveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['food', 'clothing', 'medical', 'education', 'volunteer', 'other']
  },
  resourcesRequired: {
    type: String
  },
  imageUrl: {
    type: String
  },
  location: {
    address: String,
    lat: Number,
    lng: Number
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Drive = mongoose.model('Drive', DriveSchema);

export default Drive;