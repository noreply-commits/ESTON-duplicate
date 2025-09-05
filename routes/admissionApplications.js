const express = require('express');
const { body, validationResult } = require('express-validator');
const AdmissionApplication = require('../models/AdmissionApplication'); // Import the new AdmissionApplication model
const { auth } = require('../middleware/auth'); // Assuming auth middleware is available
const nodemailer = require('nodemailer'); // For sending emails

const router = express.Router();

// @route   POST /api/admission-applications
// @desc    Submit a new admission application (public, no authentication)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      gender,
      dateOfBirth,
      residentialAddress,
      streetAddress,
      streetAddressLine2,
      cityStateProvince,
      country,
      course,
      institutionName,
      highestEducation,
      reasonForCourse,
      howHear,
      declaration,
    } = req.body;

    await AdmissionApplication.create({
      firstName,
      middleName,
      lastName,
      email,
      gender,
      dateOfBirth,
      residentialAddress,
      streetAddress,
      streetAddressLine2,
      cityStateProvince,
      country,
      course,
      institutionName,
      highestEducation,
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
      subject: 'Admission Application Received',
      html: `
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for your admission application for the ${course} course.</p>
        <p>We have received your application and will review it shortly.</p>
        <p>Best regards,</p>
        <p>The Admissions Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Admission application submitted successfully and email sent!' });
  } catch (error) {
    console.error('Admission application submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admission-applications
// @desc    Get all admission applications (admin only)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const applications = await AdmissionApplication.findAll();
    res.json({ applications });
  } catch (error) {
    console.error('Get all admission applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admission-applications/:id
// @desc    Get specific admission application details (admin only)
// @access  Private (Admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const application = await AdmissionApplication.findById(id);

    if (application.length === 0) {
      return res.status(404).json({ message: 'Admission application not found' });
    }

    res.json({ application: application });
  } catch (error) {
    console.error('Get admission application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admission-applications/:id/status
// @desc    Update admission application status (admin only)
// @access  Private (Admin)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedApplication = await AdmissionApplication.updateStatus(id, status);

    if (updatedApplication.length === 0) {
      return res.status(404).json({ message: 'Admission application not found' });
    }

    res.json({ message: 'Admission application status updated', application: updatedApplication });
  } catch (error) {
    console.error('Update admission application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admission-applications/:id
// @desc    Delete an admission application (admin only)
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await AdmissionApplication.delete(id);
    res.json(result);
  } catch (error) {
    console.error('Delete admission application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;