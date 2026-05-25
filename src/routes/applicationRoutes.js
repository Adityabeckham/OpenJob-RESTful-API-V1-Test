const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { applicationSchema, updateApplicationSchema } = require('../validators/applicationValidator');
const applicationService = require('../services/ApplicationService');

// All application routes are PROTECTED
router.use(authMiddleware);

// POST /applications - Apply for job
router.post('/', validate(applicationSchema), async (req, res, next) => {
  try {
    const { user_id, job_id, status } = req.body;
    const id = await applicationService.addApplication({ user_id, job_id, status });

    return res.status(201).json({
      status: 'success',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
});

// GET /applications - List all applications
router.get('/', async (req, res, next) => {
  try {
    const applications = await applicationService.getApplications();

    return res.status(200).json({
      status: 'success',
      data: { applications },
    });
  } catch (error) {
    next(error);
  }
});

// GET /applications/user/:userId - Applications by user
router.get('/user/:userId', async (req, res, next) => {
  try {
    const applications = await applicationService.getApplicationsByUserId(req.params.userId);

    return res.status(200).json({
      status: 'success',
      data: { applications },
    });
  } catch (error) {
    next(error);
  }
});

// GET /applications/job/:jobId - Applications by job
router.get('/job/:jobId', async (req, res, next) => {
  try {
    const applications = await applicationService.getApplicationsByJobId(req.params.jobId);

    return res.status(200).json({
      status: 'success',
      data: { applications },
    });
  } catch (error) {
    next(error);
  }
});

// GET /applications/:id - Get application detail
router.get('/:id', async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationById(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /applications/:id - Update application status
router.put('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    await applicationService.updateApplication(req.params.id, { status });

    return res.status(200).json({
      status: 'success',
      message: 'Application updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /applications/:id - Delete application
router.delete('/:id', async (req, res, next) => {
  try {
    await applicationService.deleteApplication(req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
