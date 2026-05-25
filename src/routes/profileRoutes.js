const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userService = require('../services/UserService');
const applicationService = require('../services/ApplicationService');
const bookmarkService = require('../services/BookmarkService');

// All profile routes are PROTECTED
router.use(authMiddleware);

// GET /profile - Get logged-in user profile
router.get('/', async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.userId);

    return res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// GET /profile/applications - Get my applications
router.get('/applications', async (req, res, next) => {
  try {
    const applications = await applicationService.getApplicationsByUserId(req.userId);

    return res.status(200).json({
      status: 'success',
      data: { applications },
    });
  } catch (error) {
    next(error);
  }
});

// GET /profile/bookmarks - Get my bookmarks
router.get('/bookmarks', async (req, res, next) => {
  try {
    const bookmarks = await bookmarkService.getBookmarksByUserId(req.userId);

    return res.status(200).json({
      status: 'success',
      data: { bookmarks },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
