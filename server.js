const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const admissionRoutes = require('./routes/admissions');
const admissionApplicationRoutes = require('./routes/admissionApplications');
const applicationRoutes = require('./routes/applications');
const courseRoutes = require('./routes/courses');
const adminRoutes = require('./routes/admin');

const app = express();

// Trust first proxy (needed for express-rate-limit with X-Forwarded-For)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to Database and create tables
db.createTables();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/admission-applications', admissionApplicationRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Eston Admissions Portal API is running' });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Catch-all handler to support client-side routing (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
