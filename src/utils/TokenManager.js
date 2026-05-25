const jwt = require('jsonwebtoken');
const { InvariantError } = require('./ClientError');

const TokenManager = {
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '3h' });
  },

  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  },

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError('Access token is not valid');
    }
  },

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError('Refresh token is not valid');
    }
  },
};

module.exports = TokenManager;
