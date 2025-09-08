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
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://54.162.177.3:5000/',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to DB
db.createTables();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/admission-applications', admissionApplicationRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'client/build')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Eston Admissions Portal API is running' });
});

// ✅ Always fallback to React for unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
