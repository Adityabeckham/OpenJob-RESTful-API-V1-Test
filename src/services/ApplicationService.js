const { nanoid } = require('nanoid');
const pool = require('../config/database');
const { InvariantError, NotFoundError } = require('../utils/ClientError');

class ApplicationService {
  async addApplication({ user_id, job_id, status = 'pending' }) {
    const id = `application-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO applications(id, user_id, job_id, status) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, user_id, job_id, status],
    };

    const result = await pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add application');
    }

    return result.rows[0].id;
  }

  async getApplications() {
    const result = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
    return result.rows;
  }

  async getApplicationById(id) {
    const query = {
      text: 'SELECT * FROM applications WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Application not found');
    }

    return result.rows[0];
  }

  async getApplicationsByUserId(userId) {
    const query = {
      text: 'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async getApplicationsByJobId(jobId) {
    const query = {
      text: 'SELECT * FROM applications WHERE job_id = $1 ORDER BY created_at DESC',
      values: [jobId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async updateApplication(id, { status }) {
    const query = {
      text: 'UPDATE applications SET status = $1, updated_at = current_timestamp WHERE id = $2 RETURNING id',
      values: [status, id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Application not found');
    }
  }

  async deleteApplication(id) {
    const query = {
      text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Application not found');
    }
  }
}

module.exports = new ApplicationService();
