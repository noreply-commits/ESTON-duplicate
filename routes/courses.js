const express = require('express');
const db = require('../config/db');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all active courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM courses WHERE 1=1';
    let params = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR code ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY name ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM courses WHERE 1=1';
    if (search) {
      countQuery += ` AND (name ILIKE $1 OR code ILIKE $1 OR description ILIKE $1)`;
      const countParams = search ? [`%${search}%`] : [];
      const countResult = await db.query(countQuery, countParams);
      const totalCount = parseInt(countResult.rows[0].count);

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
      const totalCount = parseInt(countResult.rows[0].count);

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
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get specific course details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT * FROM courses WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const course = result.rows[0];

    // Get application statistics for this course
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_applications,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_applications,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_applications
      FROM admissions WHERE course_id = $1
    `, [id]);

    course.statistics = statsResult.rows[0];

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id/applications
// @desc    Get applications for a specific course (for authenticated users)
// @access  Private
router.get('/:id/applications', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const courseCheck = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get applications for this course
    const result = await db.query(`
      SELECT 
        a.id,
        a.status,
        a.application_date,
        a.documents_submitted,
        u.first_name,
        u.last_name,
        u.email
      FROM admissions a
      JOIN users u ON a.user_id = u.id
      WHERE a.course_id = $1
      ORDER BY a.application_date DESC
    `, [id]);

    res.json({ 
      course: courseCheck.rows[0],
      applications: result.rows 
    });
  } catch (error) {
    console.error('Get course applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/featured
// @desc    Get featured courses (could be based on popularity, newness, etc.)
// @access  Public
router.get('/featured/featured', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, 
             COUNT(a.id) as application_count
      FROM courses c
      LEFT JOIN admissions a ON c.id = a.course_id
      GROUP BY c.id
      ORDER BY application_count DESC, c.created_at DESC
      LIMIT 6
    `);

    res.json({ featuredCourses: result.rows });
  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
