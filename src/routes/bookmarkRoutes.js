const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const bookmarkService = require('../services/BookmarkService');

// All bookmark routes are PROTECTED
// POST /jobs/:jobId/bookmark - Create bookmark for a job
router.post('/jobs/:jobId/bookmark', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { jobId } = req.params;

    const id = await bookmarkService.addBookmark(userId, jobId);

    return res.status(201).json({
      status: 'success',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
});

// GET /jobs/:jobId/bookmark/:id - Get bookmark detail
router.get('/jobs/:jobId/bookmark/:id', authMiddleware, async (req, res, next) => {
  try {
    const bookmark = await bookmarkService.getBookmarkById(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: bookmark,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /jobs/:jobId/bookmark - Delete bookmark by user and job
router.delete('/jobs/:jobId/bookmark', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { jobId } = req.params;

    await bookmarkService.deleteBookmarkByUserAndJob(userId, jobId);

    return res.status(200).json({
      status: 'success',
      message: 'Bookmark deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /bookmarks - Get all bookmarks for logged-in user
router.get('/bookmarks', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;
    const bookmarks = await bookmarkService.getBookmarksByUserId(userId);

    return res.status(200).json({
      status: 'success',
      data: { bookmarks },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
