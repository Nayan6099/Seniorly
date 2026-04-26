const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const emailRoutes = require('./routes/emailRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

// Initialize Express app
const app = express();

// CORS Configuration
const allowedOriginRegex = /https?:\/\/(.*\.?seniorly\.space|seniorly-.*\.vercel\.app|seniorly-backend\.onrender\.com|localhost|127\.0\.0\.1)(:\d+)?$/;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOriginRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/emails', emailRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri || uri.includes('localhost')) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('MONGODB_URI is missing or pointing to localhost in PRODUCTION!');
      }
    }

    const conn = await mongoose.connect(uri || 'mongodb://localhost:27017/seniorly');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Seniorly Backend is LIVE and Connected to Database Successfully`);
  } catch (error) {
    console.error('CRITICAL: Database connection failed!');
    console.error('Error Message:', error.message);
    if (!process.env.MONGODB_URI) {
      console.error('HINT: The MONGODB_URI environment variable is UNDEFINED. Please check Render settings.');
    }
    process.exit(1);
  }
};

// Connect to database and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Seniorly Backend is LIVE on port ${PORT}`);
    console.log(`Connected to Database Successfully`);
  }).on('error', (err) => {
    console.error('CRITICAL: Server failed to start:', err);
    process.exit(1);
  });
}).catch(err => {
  console.error('CRITICAL: Initial connection/setup failed:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  try {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

module.exports = app;
