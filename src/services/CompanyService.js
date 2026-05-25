const { nanoid } = require('nanoid');
const pool = require('../config/database');
const { InvariantError, NotFoundError } = require('../utils/ClientError');

class CompanyService {
  async addCompany({ name, location, description }) {
    const id = `company-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO companies(id, name, location, description) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, location, description || null],
    };

    const result = await pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add company');
    }

    return result.rows[0].id;
  }

  async getCompanies() {
    const result = await pool.query('SELECT * FROM companies ORDER BY created_at DESC');
    return result.rows;
  }

  async getCompanyById(id) {
    const query = {
      text: 'SELECT * FROM companies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Company not found');
    }

    return result.rows[0];
  }

  async updateCompany(id, { name, location, description }) {
    const query = {
      text: 'UPDATE companies SET name = $1, location = $2, description = $3, updated_at = current_timestamp WHERE id = $4 RETURNING id',
      values: [name, location, description || null, id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Company not found');
    }
  }

  async deleteCompany(id) {
    const query = {
      text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Company not found');
    }
  }
}

module.exports = new CompanyService();
