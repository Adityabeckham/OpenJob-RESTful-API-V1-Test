const { ClientError } = require('../utils/ClientError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }

  console.error('Server Error:', err);
  return res.status(500).json({
    status: 'failed',
    message: 'Internal server error',
  });
};

module.exports = errorHandler;
