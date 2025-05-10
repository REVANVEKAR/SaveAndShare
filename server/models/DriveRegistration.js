import mongoose from 'mongoose';

const DriveRegistrationSchema = new mongoose.Schema({
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'attended', 'cancelled'],
    default: 'registered'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate registrations
DriveRegistrationSchema.index({ driveId: 1, userId: 1 }, { unique: true });

const DriveRegistration = mongoose.model('DriveRegistration', DriveRegistrationSchema);

export default DriveRegistration;