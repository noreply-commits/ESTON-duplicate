const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'dpg-d2tver7fte5s73akuko0-a',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eston',
  user: process.env.DB_USER || 'eston',
  password: process.env.DB_PASSWORD || '3imVIm6JKjF9RgkVpV4TYwAH4XNDMWm5',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Create tables if they don't exist
const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        duration VARCHAR(100),
        requirements TEXT,
        fee DECIMAL(10,2),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Applications table
 

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        middle_name VARCHAR(255),
        last_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        email VARCHAR(255) UNIQUE NOT NULL,
        gender VARCHAR(50) NOT NULL,
        residential_address VARCHAR(255) NOT NULL,
        street_address VARCHAR(255) NOT NULL,
        street_address_line_2 VARCHAR(255) NOT NULL,
        city_state_province VARCHAR(255) NOT NULL,
        country VARCHAR(100) NOT NULL,
        course VARCHAR(255) NOT NULL,
        institution_name VARCHAR(255) NOT NULL,
        highest_education VARCHAR(255) NOT NULL,
        date_of_birth DATE NOT NULL,
        reason_for_course TEXT NOT NULL,
        how_hear VARCHAR(255) NOT NULL,
        declaration BOOLEAN NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        review_date TIMESTAMP,
        admin_notes TEXT
      )
    `);

    // Insert dummy data into applications table
    await pool.query(`
      INSERT INTO applications (
        first_name, middle_name, last_name, phone_number, email, gender,
        residential_address, street_address, street_address_line_2, city_state_province, country,
        course, institution_name, highest_education, date_of_birth, reason_for_course,
        how_hear, declaration, status
      ) VALUES
      ('John', 'Michael', 'Doe', '+1234567890', 'john.doe@example.com', 'Male',
       '123 Main St', '123 Main St', 'Apt 4B', 'New York, NY', 'USA',
       'Bachelor of Computer Science', 'Eston University', 'High School Diploma', '1995-05-15',
       'To gain knowledge in computer science and pursue a career in software development.',
       'Internet Search', true, 'pending'),
      ('Jane', 'Elizabeth', 'Smith', '+1987654321', 'jane.smith@example.com', 'Female',
       '456 Oak Ave', '456 Oak Ave', '', 'Los Angeles, CA', 'USA',
       'Bachelor of Business Administration', 'Eston University', 'High School Diploma', '1997-08-22',
       'Interested in business management and entrepreneurship.',
       'Social Media', true, 'approved'),
      ('Ahmed', '', 'Khan', '+447123456789', 'ahmed.khan@example.com', 'Male',
       '789 Pine Rd', '789 Pine Rd', 'Suite 100', 'London', 'UK',
       'Master of Information Technology', 'Eston University', 'Bachelor Degree', '1990-12-10',
       'To advance my career in IT and gain specialized skills.',
       'Referral', true, 'pending')
    `);


    // Insert default admin user if not exists
    const adminCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@eston.edu.gh']);
    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(`
        INSERT INTO users (email, password, first_name, last_name, role)
        VALUES ($1, $2, $3, $4, $5)
      `, ['admin@eston.edu.gh', hashedPassword, 'Admin', 'User', 'admin']);
      console.log('Default admin user created');
    }

    // Insert sample courses if not exists
    const courseCheck = await pool.query('SELECT * FROM courses LIMIT 1');
    if (courseCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO courses (name, code, description, duration, requirements, fee) VALUES
        ('Bachelor of Computer Science', 'BCS001', 'Comprehensive computer science program covering programming, algorithms, and software development', '4 years', 'High school diploma with mathematics', 5000.00),
        ('Bachelor of Business Administration', 'BBA001', 'Business administration degree focusing on management, marketing, and finance', '4 years', 'High school diploma', 4500.00),
        ('Master of Information Technology', 'MIT001', 'Advanced IT program for professionals seeking technical leadership roles', '2 years', 'Bachelor degree in related field', 8000.00)
      `);
      console.log('Sample courses created');
    }

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  createTables
};
