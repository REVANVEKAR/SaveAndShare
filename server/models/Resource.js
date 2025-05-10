import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  contactInfo: {
    type: String,
    required: true
  },
  donorName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'collected'],
    default: 'available'
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO'
  },
  claimedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Resource = mongoose.model('Resource', ResourceSchema);

export default Resource;