import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const NGOSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'not submitted'],
    default: 'not submitted'
  },
  governmentId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
NGOSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
NGOSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const NGO = mongoose.model('NGO', NGOSchema);

export default NGO;