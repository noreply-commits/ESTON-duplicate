const { query } = require('../config/db');

class Application {
  static async create({ firstName, middleName, lastName, email, gender, residentialAddress, streetAddress, streetAddressLine2, cityStateProvince, country, course, institutionName, highestEducation, dateOfBirth, reasonForCourse, howHear, declaration }) {
    const res = await query(
      'INSERT INTO applications (first_name, middle_name, last_name, phone_number, email, gender, residential_address, street_address, street_address_line_2, city_state_province, country, course, institution_name, highest_education, date_of_birth, reason_for_course, how_hear, declaration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *',
      [firstName, middleName, lastName, phoneNumber, email, gender, residentialAddress, streetAddress, streetAddressLine2, cityStateProvince, country, course, institutionName, highestEducation, dateOfBirth, reasonForCourse, howHear, declaration]
    );
    return res.rows;
  }

  static async findById(id) {
    const res = await query('SELECT * FROM applications WHERE id = $1', [id]);
    return res.rows;
  }

  static async findByEmail(email) {
    const res = await query('SELECT * FROM applications WHERE email = $1', [email]);
    return res.rows;
  }

  static async findAll(searchTerm = '', statusFilter = 'all') {
    let queryString = 'SELECT *, course as course_name FROM applications';
    const queryParams = [];
    const conditions = [];

    if (searchTerm) {
      conditions.push('(first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR course ILIKE $1)');
      queryParams.push(`%${searchTerm}%`);
    }

    if (statusFilter !== 'all') {
      conditions.push(`status = $${queryParams.length + 1}`);
      queryParams.push(statusFilter);
    }

    if (conditions.length > 0) {
      queryString += ' WHERE ' + conditions.join(' AND ');
    }

    queryString += ' ORDER BY application_date DESC';
    
    const res = await query(queryString, queryParams);
    return res.rows;
  }

  static async updateStatus(id, status, adminNotes = null) {
    const res = await query(
      'UPDATE applications SET status = $1, admin_notes = $2, review_date = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [status, adminNotes, id]
    );
    return res.rows;
  }

  static async delete(id) {
    await query('DELETE FROM applications WHERE id = $1', [id]);
    return { message: 'Application deleted successfully' };
  }
}

module.exports = Application;
