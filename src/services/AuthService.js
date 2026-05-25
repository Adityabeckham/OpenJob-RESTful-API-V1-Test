const pool = require('../config/database');
const { InvariantError } = require('../utils/ClientError');

class AuthService {
  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications(token) VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Refresh token is not valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await pool.query(query);
  }
}

module.exports = new AuthService();
