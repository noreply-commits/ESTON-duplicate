const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { auth } = require('../middleware/auth');
const Application = require('../models/Application'); // Import the PostgreSQL Application model
const nodemailer = require('nodemailer'); // For sending emails

const router = express.Router();

// @route   POST /api/admissions/apply
// @desc    Submit a new admission application
// @access  Private
router.post('/apply', auth, [
  body('course_id').isInt({ min: 1 }),
  body('documents_submitted').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { course_id, documents_submitted = false } = req.body;

    // Check if course exists and is active
    const courseResult = await db.query('SELECT * FROM courses WHERE id = $1 AND is_active = true', [course_id]);
    if (courseResult.rows.length === 0) {
      return res.status(400).json({ message: 'Course not found or inactive' });
    }

    // Check if user already has a pending application for this course
    const existingApplication = await db.query(`
      SELECT * FROM admissions 
      WHERE user_id = $1 AND course_id = $2 AND status IN ('pending', 'approved', 'rejected')
    `, [req.user.id, course_id]);

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ message: 'You already have an application for this course' });
    }

    // Create admission application
    const result = await db.query(`
      INSERT INTO admissions (user_id, course_id, documents_submitted)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [req.user.id, course_id, documents_submitted]);

    const application = result.rows[0];

    // Get course details
    const course = courseResult.rows[0];

    res.json({
      message: 'Application submitted successfully',
      application: {
        id: application.id,
        status: application.status,
        application_date: application.application_date,
        course: {
          id: course.id,
          name: course.name,
          code: course.code
        }
      }
    });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/applications
// @desc    Submit a new application (public, no authentication)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      gender,
      nationality,
      residentialAddress,
      streetAddress,
      streetAddressLine2,
      cityStateProvince,
      country,
      course,
      institutionName,
      highestEducation,
      dateOfBirth,
      reasonForCourse,
      howHear,
      declaration,
    } = req.body;

    await Application.create({
      firstName,
      middleName,
      lastName,
      email,
      gender,
      nationality,
      residentialAddress,
      streetAddress,
      streetAddressLine2,
      cityStateProvince,
      country,
      course,
      institutionName,
      highestEducation,
      dateOfBirth,
      reasonForCourse,
      howHear,
      declaration,
    });

    // Send email to user
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services or SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Application Received',
      html: `
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for your application for the ${course} course.</p>
        <p>We have received your application and will review it shortly.</p>
        <p>Best regards,</p>
        <p>The Admissions Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Application submitted successfully and email sent!' });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/my-applications
// @desc    Get current user's applications
// @access  Private
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.findByUserId(req.user.id);
    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/:id
// @desc    Get specific application details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (application.length === 0 || application.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ application: application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (admin only)
// @access  Private (Admin)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedApplication = await Application.updateStatus(id, status);

    if (updatedApplication.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application status updated', application: updatedApplication });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete an application (admin only)
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await Application.delete(id);
    res.json(result);
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
