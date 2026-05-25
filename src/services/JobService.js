const { nanoid } = require('nanoid');
const pool = require('../config/database');
const { InvariantError, NotFoundError } = require('../utils/ClientError');

class JobService {
  async addJob({ company_id, category_id, title, description, job_type, experience_level, location_type, location_city, salary_min, salary_max, is_salary_visible, status }) {
    const id = `job-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO jobs(id, company_id, category_id, title, description, job_type, experience_level, location_type, location_city, salary_min, salary_max, is_salary_visible, status)
             VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      values: [id, company_id, category_id, title, description || null, job_type || null, experience_level || null, location_type || null, location_city || null, salary_min || null, salary_max || null, is_salary_visible || false, status || 'open'],
    };

    const result = await pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add job');
    }

    return result.rows[0].id;
  }

  async getJobs({ title, companyName } = {}) {
    let queryText = `
      SELECT j.*, c.name AS company_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    if (title && title.trim() !== '') {
      queryText += ` AND j.title ILIKE $${paramIndex}`;
      values.push(`%${title}%`);
      paramIndex++;
    }

    if (companyName && companyName.trim() !== '') {
      queryText += ` AND c.name ILIKE $${paramIndex}`;
      values.push(`%${companyName}%`);
      paramIndex++;
    }

    queryText += ' ORDER BY j.created_at DESC';

    const result = await pool.query(queryText, values);
    return result.rows;
  }

  async getJobById(id) {
    const query = {
      text: `SELECT j.*, c.name AS company_name
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE j.id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Job not found');
    }

    return result.rows[0];
  }

  async getJobsByCompanyId(companyId) {
    const query = {
      text: `SELECT j.*, c.name AS company_name
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE j.company_id = $1
             ORDER BY j.created_at DESC`,
      values: [companyId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async getJobsByCategoryId(categoryId) {
    const query = {
      text: `SELECT j.*, c.name AS company_name
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE j.category_id = $1
             ORDER BY j.created_at DESC`,
      values: [categoryId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async updateJob(id, { title, description, salary_max }) {
    const query = {
      text: `UPDATE jobs SET title = $1, description = $2, salary_max = $3, updated_at = current_timestamp
             WHERE id = $4 RETURNING id`,
      values: [title, description || null, salary_max || null, id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Job not found');
    }
  }

  async deleteJob(id) {
    const query = {
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Job not found');
    }
  }
}

module.exports = new JobService();
