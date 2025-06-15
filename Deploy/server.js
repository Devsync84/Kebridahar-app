require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Enhanced Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Supercharged MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5s timeout
      maxPoolSize: 10, // Connection pool size
      socketTimeoutMS: 45000 // Close sockets after 45s inactivity
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Initialize default users
    await require('./models/User').initialize(); 
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit with failure
  }
};

// Real-time connection monitoring
mongoose.connection.on('connected', () => {
  console.log('📊 MongoDB event - Connected');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB event - Disconnected');
});

// Routes
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/users', require('./routes/users'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'UP',
    database: dbStatus,
    timestamp: new Date()
  });
});

// Serve frontend (must be last route)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log('⏳ Connecting to MongoDB...');
  await connectDB(); // Initialize DB connection
});