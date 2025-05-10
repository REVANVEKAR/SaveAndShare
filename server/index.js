import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import ngoRoutes from './routes/ngo.js';
import userRoutes from './routes/user.js';
import driveRoutes from './routes/drives.js';
import resourceRoutes from './routes/resources.js';
import webhookRoutes from './routes/webhooks.js';
import { setupBot } from './config/telegram.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/community-aid')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/user', userRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/webhooks', webhookRoutes);

// Set up Telegram bot with polling
setupBot();

// Base route
app.get('/', (req, res) => {
  res.send('Community Aid Platform API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});