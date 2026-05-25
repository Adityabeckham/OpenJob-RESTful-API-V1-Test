const { nanoid } = require('nanoid');
const pool = require('../config/database');
const { InvariantError, NotFoundError } = require('../utils/ClientError');

class CategoryService {
  async addCategory({ name }) {
    const id = `category-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO categories(id, name) VALUES($1, $2) RETURNING id',
      values: [id, name],
    };

    const result = await pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add category');
    }

    return result.rows[0].id;
  }

  async getCategories() {
    const result = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
    return result.rows;
  }

  async getCategoryById(id) {
    const query = {
      text: 'SELECT * FROM categories WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Category not found');
    }

    return result.rows[0];
  }

  async updateCategory(id, { name }) {
    const query = {
      text: 'UPDATE categories SET name = $1, updated_at = current_timestamp WHERE id = $2 RETURNING id',
      values: [name, id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Category not found');
    }
  }

  async deleteCategory(id) {
    const query = {
      text: 'DELETE FROM categories WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Category not found');
    }
  }
}

module.exports = new CategoryService();
