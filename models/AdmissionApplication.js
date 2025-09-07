const { query } = require('../config/db');

class AdmissionApplication {
  static async create({
    firstName,
    middleName,
    lastName,
    phoneNumber,
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
  }) {
    const res = await query(
      `INSERT INTO admission_applications (
        first_name,
        middle_name,
        last_name,
        phone_number,
        email,
        gender,
        date_of_birth,
        residential_address,
        street_address,
        street_address_line_2,
        city_state_province,
        country,
        course,
        institution_name,
        highest_education,
        reason_for_course,
        how_hear,
        declaration
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
      [
        firstName,
        middleName,
        lastName,
        phoneNumber,
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
      ]
    );
    return res.rows;
  }

  static async findById(id) {
    const res = await query('SELECT * FROM admission_applications WHERE id = $1', [id]);
    return res.rows;
  }

  static async findByEmail(email) {
    const res = await query('SELECT * FROM admission_applications WHERE email = $1', [email]);
    return res.rows;
  }

  static async findAll() {
    const res = await query('SELECT * FROM admission_applications ORDER BY application_date DESC');
    return res.rows;
  }

  static async updateStatus(id, status) {
    const res = await query(
      'UPDATE admission_applications SET status = $1, review_date = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return res.rows;
  }

  static async delete(id) {
    await query('DELETE FROM admission_applications WHERE id = $1', [id]);
    return { message: 'Admission application deleted successfully' };
  }
}

module.exports = AdmissionApplication;