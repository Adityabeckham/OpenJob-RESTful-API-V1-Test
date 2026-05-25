const { AuthenticationError } = require('../utils/ClientError');
const TokenManager = require('../utils/TokenManager');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid authentication token');
    }

    const token = authHeader.split(' ')[1];
    const decoded = TokenManager.verifyAccessToken(token);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(401).json({
        status: 'failed',
        message: error.message,
      });
    }
    return res.status(401).json({
      status: 'failed',
      message: 'Invalid or expired token',
    });
  }
};

module.exports = authMiddleware;
