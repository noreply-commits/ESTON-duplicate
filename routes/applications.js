const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const { auth } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const router = express.Router();

// @route   POST /api/applications
// @desc    Submit a new application (public, no authentication)
// @access  Public
router.post('/', [
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('email').isEmail(),
  body('gender').notEmpty(),
  body('residentialAddress').notEmpty(),
  body('streetAddress').notEmpty(),
  body('streetAddressLine2').notEmpty(),
  body('cityStateProvince').notEmpty(),
  body('country').notEmpty(),
  body('course').notEmpty(),
  body('institutionName').notEmpty(),
  body('highestEducation').notEmpty(),
  body('dateOfBirth').notEmpty(),
  body('reasonForCourse').notEmpty(),
  body('howHear').notEmpty(),
  body('declaration').isBoolean().equals('true'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Create transporter ONCE at the top
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const {
      firstName,
      middleName,
      lastName,
      email,
      gender,
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

    try {
      await Application.create({
        firstName,
        middleName,
        lastName,
        email,
        gender,
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
      // Send notification email to all users in the users table
      try {
        const pool = require('../config/db');
        const usersResult = await pool.query('SELECT email FROM users');
        const userEmails = usersResult.rows.map(row => row.email);
        if (userEmails.length > 0) {
          const allUsersMailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmails,
            subject: 'New Application Submitted',
            html: `<p>A new application has been submitted to Eston IT College.</p>`
          };
          await transporter.sendMail(allUsersMailOptions);
        }
      } catch (allUsersEmailError) {
        console.error('Error sending email to all users:', allUsersEmailError);
      }
    } catch (dbError) {
      if (dbError.code === '23505') { // Unique constraint violation
        return res.status(400).json({ message: 'An application with this email already exists.' });
      }
      throw dbError;
    }

    // Send email to user
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Received Eston IT college Admission Form',
        html: `
          <p>Dear ${firstName},</p>
          <p>We have received your application to ${course}. This is just the first step in the application process.</p>
          <p>To complete the application process, you are required to visit our admissions desk at the address below with your registration fee (GHS150.00), two passport size photos and any government issued identification card.</p>
          <p><strong>Admissions Desk</strong><br>
          Front Desk,<br>
          Techland IT Solutions Ltd, Alajo, Opposit the National Police Training School (Tesano), Greater Accra, Ghana.<br>
          Helpline: 0302280388 / 0503225669</p>
          <p>Thank you and we hope to see you soon.</p>
          <p>Eston IT College | <a href="http://www.eston.edu.gh">www.eston.edu.gh</a></p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/my-applications
// @desc    Get applications for the authenticated user
// @access  Private (User)
router.get('/my-applications', auth, async (req, res) => {
  try {
    // Assuming req.user.email is set by the auth middleware
    const applications = await Application.findByEmail(req.user.email);
    res.json({ applications });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications
// @desc    Get all applications (admin only)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { search, status } = req.query;
    const applications = await Application.findAll(search, status);
    res.json({ applications });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/:id
// @desc    Get specific application details (admin only)
// @access  Private (Admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const application = await Application.findById(id);

    if (application.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ application });
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
    const { status, admin_notes } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedApplication = await Application.updateStatus(id, status, admin_notes);

    if (updatedApplication.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application status updated', application: updatedApplication });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/documents
// @desc    Update application documents_submitted status (user/admin)
// @access  Private (User/Admin)
router.put('/:id/documents', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { documents_submitted } = req.body;

    // Ensure documents_submitted is a boolean
    if (typeof documents_submitted !== 'boolean') {
      return res.status(400).json({ message: 'Invalid value for documents_submitted' });
    }

    // Check if application exists
    const applicationCheck = await Application.findById(id);
    if (applicationCheck.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only the owner of the application or an admin can update this
    if (req.user.role !== 'admin' && applicationCheck.email !== req.user.email) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const res = await query(
      'UPDATE applications SET documents_submitted = $1, review_date = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [documents_submitted, id]
    );

    res.json({ message: 'Documents status updated', application: res.rows });
  } catch (error) {
    console.error('Update documents status error:', error);
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
