const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const pool = require('../config/database');
const { InvariantError, NotFoundError, AuthenticationError } = require('../utils/ClientError');

class UserService {
  async addUser({ name, email, password, role = 'user' }) {
    // Check if email already exists
    const checkQuery = {
      text: 'SELECT id FROM users WHERE email = $1',
      values: [email],
    };
    const checkResult = await pool.query(checkQuery);
    if (checkResult.rows.length > 0) {
      throw new InvariantError('Email already registered');
    }

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, email, hashedPassword, role],
    };

    const result = await pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add user');
    }

    return result.rows[0].id;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('User not found');
    }

    return result.rows[0];
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE email = $1',
      values: [email],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError('Invalid credentials');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Invalid credentials');
    }

    return id;
  }
}

module.exports = new UserService();
