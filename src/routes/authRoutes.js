const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { loginSchema, refreshTokenSchema } = require('../validators/authValidator');
const userService = require('../services/UserService');
const authService = require('../services/AuthService');
const TokenManager = require('../utils/TokenManager');

// POST /authentications - Login (PUBLIC)
router.post('/', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const id = await userService.verifyUserCredential(email, password);

    const accessToken = TokenManager.generateAccessToken({ id });
    const refreshToken = TokenManager.generateRefreshToken({ id });

    await authService.addRefreshToken(refreshToken);

    return res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /authentications - Refresh access token (PUBLIC)
router.put('/', validate(refreshTokenSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // Verify the refresh token signature
    const decoded = TokenManager.verifyRefreshToken(refreshToken);

    // Verify it exists in the database
    await authService.verifyRefreshToken(refreshToken);

    // Generate new access token
    const accessToken = TokenManager.generateAccessToken({ id: decoded.id });

    return res.status(200).json({
      status: 'success',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /authentications - Logout (PROTECTED)
router.delete('/', authMiddleware, validate(refreshTokenSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // Verify the refresh token exists in database
    await authService.verifyRefreshToken(refreshToken);

    // Delete it
    await authService.deleteRefreshToken(refreshToken);

    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
