const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const admissionRoutes = require('./routes/admissions');
const admissionApplicationRoutes = require('./routes/admissionApplications'); // New route
const applicationRoutes = require('./routes/applications'); // New route for applications table
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
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const allowedOrigins = ['https://estonschool.onrender.com', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to Database and create tables
db.createTables();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/admission-applications', admissionApplicationRoutes); // New route
app.use('/api/applications', applicationRoutes); // New route for applications table
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Eston Admissions Portal API is running' });
});

// Serve static assets
app.use(express.static('client/build'));

// Catch-all handler: serve index.html for client-side routes, but not for API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
