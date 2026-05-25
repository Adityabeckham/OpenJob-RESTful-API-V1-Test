const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { jobSchema, updateJobSchema } = require('../validators/jobValidator');
const jobService = require('../services/JobService');

// GET /jobs - List all jobs with optional search (PUBLIC)
router.get('/', async (req, res, next) => {
  try {
    const title = req.query.title;
    const companyName = req.query['company-name'];

    const jobs = await jobService.getJobs({ title, companyName });

    return res.status(200).json({
      status: 'success',
      data: { jobs },
    });
  } catch (error) {
    next(error);
  }
});

// GET /jobs/company/:companyId - Jobs by company (PUBLIC)
router.get('/company/:companyId', async (req, res, next) => {
  try {
    const jobs = await jobService.getJobsByCompanyId(req.params.companyId);

    return res.status(200).json({
      status: 'success',
      data: { jobs },
    });
  } catch (error) {
    next(error);
  }
});

// GET /jobs/category/:categoryId - Jobs by category (PUBLIC)
router.get('/category/:categoryId', async (req, res, next) => {
  try {
    const jobs = await jobService.getJobsByCategoryId(req.params.categoryId);

    return res.status(200).json({
      status: 'success',
      data: { jobs },
    });
  } catch (error) {
    next(error);
  }
});

// GET /jobs/:id - Get job detail (PUBLIC)
router.get('/:id', async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: job,
    });
  } catch (error) {
    next(error);
  }
});

// POST /jobs - Create job (PROTECTED)
router.post('/', authMiddleware, validate(jobSchema), async (req, res, next) => {
  try {
    const id = await jobService.addJob(req.body);

    return res.status(201).json({
      status: 'success',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /jobs/:id - Update job (PROTECTED)
router.put('/:id', authMiddleware, validate(updateJobSchema), async (req, res, next) => {
  try {
    await jobService.updateJob(req.params.id, req.body);

    return res.status(200).json({
      status: 'success',
      message: 'Job updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /jobs/:id - Delete job (PROTECTED)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'Job deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
