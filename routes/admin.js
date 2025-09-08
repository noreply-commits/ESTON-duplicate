const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// All admin routes require admin authentication
router.use(adminAuth);

// @route   POST /api/admin/users
// @desc    Create a new user (admin only)
// @access  Private (Admin only)
router.post('/users', async (req, res) => {
  try {
    const { email, first_name, last_name, phone, role, password } = req.body;
    if (!email || !first_name || !last_name || !role || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Check if user already exists
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user
    const result = await db.query(`
      INSERT INTO users (email, first_name, last_name, phone, role, password)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name, last_name, phone, role, created_at
    `, [email, first_name, last_name, phone, role, hashedPassword]);
    res.status(201).json({ user: result.rows });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const userCheck = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Delete user
    await db.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/admissions
// @desc    Get all admissions with user and course info
// @access  Private (Admin only)
router.get('/admissions', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        a.id,
        a.status,
        a.application_date,
        a.documents_submitted,
        u.first_name,
        u.last_name,
        u.email,
        c.name as course_name
      FROM admissions a
      JOIN users u ON a.user_id = u.id
      JOIN courses c ON a.course_id = c.id
      ORDER BY a.application_date DESC
    `);
    res.json({ admissions: result.rows });
  } catch (error) {
    console.error('Get admissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/courses
// @desc    Get all courses (active and inactive) for admin
// @access  Private (Admin only)
router.get('/courses', async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM courses';
    let params = [];
    let paramCount = 1;

    if (search) {
      query += ` WHERE (name ILIKE $${paramCount} OR code ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += search ? ` ORDER BY name ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}` : ` ORDER BY name ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM courses';
    if (search) {
      countQuery += ` WHERE (name ILIKE $1 OR code ILIKE $1 OR description ILIKE $1)`;
      const countParams = [`%${search}%`];
      const countResult = await db.query(countQuery, countParams);
      const totalCount = parseInt(countResult.rows.count);
      res.json({
        courses: result.rows,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: offset + result.rows.length < totalCount
        }
      });
    } else {
      const countResult = await db.query('SELECT COUNT(*) FROM courses');
      const totalCount = parseInt(countResult.rows.count);
      res.json({
        courses: result.rows,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: offset + result.rows.length < totalCount
        }
      });
    }
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get total counts for users, courses, and applications
    const totalUsersResult = await db.query('SELECT COUNT(*) FROM users');
    const totalCoursesResult = await db.query('SELECT COUNT(*) FROM courses');
    const totalApplicationsResult = await db.query('SELECT COUNT(*) FROM applications');

    // Get overall statistics from applications
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_applications,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_applications,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_applications
      FROM applications
    `);

    res.json({
      totalUsers: parseInt(totalUsersResult.rows[0].count),
      totalCourses: parseInt(totalCoursesResult.rows[0].count),
      totalApplications: parseInt(totalApplicationsResult.rows[0].count),
      applicationStatistics: statsResult.rows[0]
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/applications
// @desc    Get all applications with filtering and pagination
// @access  Private (Admin only)
router.get('/applications', async (req, res) => {
  try {
    const { 
      status, 
      course_id, 
      documents_submitted, 
      limit = 20, 
      offset = 0,
      search 
    } = req.query;

    let query = `
      SELECT
        a.id,
        a.first_name,
        a.middle_name,
        a.last_name,
        a.email,
        a.gender,
        a.residential_address,
        a.street_address,
        a.street_address_line_2,
        a.city_state_province,
        a.country,
        a.course AS course_name,
        a.institution_name,
        a.highest_education,
        a.date_of_birth,
        a.reason_for_course,
        a.how_hear,
        a.declaration,
        a.status,
        a.application_date,
        a.review_date,
        a.admin_notes,
        u.first_name AS user_first_name,
        u.last_name AS user_last_name,
        u.email AS user_email,
        u.phone AS user_phone
      FROM applications a
      LEFT JOIN users u ON a.email = u.email
      WHERE 1=1
    `;
    
    let params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND a.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (course_id) {
      query += ` AND a.course = (SELECT name FROM courses WHERE id = $${paramCount})`;
      params.push(course_id);
      paramCount++;
    }

    if (documents_submitted !== undefined) {
      query += ` AND a.highest_education IS NOT NULL`;
    }

    if (search) {
      query += ` AND (u.first_name ILIKE $${paramCount} OR u.last_name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY a.application_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) FROM applications a
      WHERE 1=1
    `;
    
    let countParams = [];
    let countParamCount = 1;

    if (status) {
      countQuery += ` AND a.status = $${countParamCount}`;
      countParams.push(status);
      countParamCount++;
    }

    if (course_id) {
      countQuery += ` AND a.course = (SELECT name FROM courses WHERE id = $${countParamCount})`;
      countParams.push(course_id);
      countParamCount++;
    }

    if (documents_submitted !== undefined) {
      countQuery += ` AND a.highest_education IS NOT NULL`;
    }

    if (search) {
      countQuery += ` AND (u.first_name ILIKE $${countParamCount} OR u.last_name ILIKE $${countParamCount} OR u.email ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
      countParamCount++;
    }

    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows.count);

    res.json({
      applications: result.rows,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + result.rows.length < totalCount
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/applications/:id/status
// @desc    Update application status
// @access  Private (Admin only)
router.put('/applications/:id/status', [
  body('status').isIn(['pending', 'approved', 'rejected']),
  body('admin_notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, admin_notes } = req.body;

    // Check if application exists
    const applicationCheck = await db.query('SELECT * FROM applications WHERE id = $1', [id]);
    if (applicationCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application status
    const result = await db.query(`
      UPDATE applications
      SET status = $1, admin_notes = $2, review_date = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [status, admin_notes, id]);

    res.json({
      message: 'Application status updated successfully',
      application: result.rows
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const { limit = 20, offset = 0, search, role } = req.query;

    let query = 'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE 1=1';
    let params = [];
    let paramCount = 1;

    if (role) {
      query += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    if (search) {
      query += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1';
    let countParams = [];
    let countParamCount = 1;

    if (role) {
      countQuery += ` AND role = $${countParamCount}`;
      countParams.push(role);
      countParamCount++;
    }

    if (search) {
      countQuery += ` AND (first_name ILIKE $${countParamCount} OR last_name ILIKE $${countParamCount} OR email ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
      countParamCount++;
    }

    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows.count);

    res.json({
      users: result.rows,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + result.rows.length < totalCount
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/courses
// @desc    Create a new course
// @access  Private (Admin only)
router.post('/courses', [
  body('name').notEmpty().trim(),
  body('code').notEmpty().trim(),
  body('description').optional().trim(),
  body('duration').optional().trim(),
  body('requirements').optional().trim(),
  body('fee').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, code, description, duration, requirements, fee } = req.body;

    // Check if course code already exists
    const existingCourse = await db.query('SELECT * FROM courses WHERE code = $1', [code]);
    if (existingCourse.rows.length > 0) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    // Create course
    const result = await db.query(`
      INSERT INTO courses (name, code, description, duration, requirements, fee)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, code, description, duration, requirements, fee]);

    res.json({
      message: 'Course created successfully',
      course: result.rows
    });

  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/courses/:id
// @desc    Update a course
// @access  Private (Admin only)
router.put('/courses/:id', [
  body('name').optional().notEmpty().trim(),
  body('code').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('duration').optional().trim(),
  body('requirements').optional().trim(),
  body('fee').optional().isFloat({ min: 0 }),
  body('is_active').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, code, description, duration, requirements, fee, is_active } = req.body;

    // Check if course exists
    const courseCheck = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if new code conflicts with existing courses
    if (code && code !== courseCheck.rows.code) {
      const existingCourse = await db.query('SELECT * FROM courses WHERE code = $1 AND id != $2', [code, id]);
      if (existingCourse.rows.length > 0) {
        return res.status(400).json({ message: 'Course code already exists' });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updateFields.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (code) {
      updateFields.push(`code = $${paramCount}`);
      values.push(code);
      paramCount++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (duration !== undefined) {
      updateFields.push(`duration = $${paramCount}`);
      values.push(duration);
      paramCount++;
    }

    if (requirements !== undefined) {
      updateFields.push(`requirements = $${paramCount}`);
      values.push(requirements);
      paramCount++;
    }

    if (fee !== undefined) {
      updateFields.push(`fee = $${paramCount}`);
      values.push(fee);
      paramCount++;
    }

    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);

    const result = await db.query(`
      UPDATE courses SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    res.json({
      message: 'Course updated successfully',
      course: result.rows
    });

  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const courseCheck = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if there are any applications for this course
    const applicationsCheck = await db.query('SELECT COUNT(*) FROM applications WHERE course = (SELECT name FROM courses WHERE id = $1)', [id]);
    if (parseInt(applicationsCheck.rows.count) > 0) {
      return res.status(400).json({ message: 'Cannot delete course with existing applications. Please deactivate it instead.' });
    }

    // Delete course
    await db.query('DELETE FROM courses WHERE id = $1', [id]);

    res.json({ message: 'Course deleted successfully' });

  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update a user's role
// @access  Private (Admin only)
router.put('/users/:id', [
  body('role').isIn(['user', 'admin', 'student'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { role } = req.body;

    // Check if user exists
    const userCheck = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user role
    const result = await db.query(`
      UPDATE users
      SET role = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, first_name, last_name, role, created_at, updated_at
    `, [role, id]);

    res.json({
      message: 'User role updated successfully',
      user: result.rows
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/courses/:id/toggle-status
// @desc    Toggle course active status
// @access  Private (Admin only)
router.put('/courses/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Check if course exists
    const courseCheck = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update is_active status
    const result = await db.query(
      'UPDATE courses SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [is_active, id]
    );

    res.json({
      message: 'Course status updated successfully',
      course: result.rows
    });
  } catch (error) {
    console.error('Toggle course status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
