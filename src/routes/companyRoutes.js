const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { companySchema } = require('../validators/companyValidator');
const companyService = require('../services/CompanyService');

// GET /companies - List all companies (PUBLIC)
router.get('/', async (req, res, next) => {
  try {
    const companies = await companyService.getCompanies();

    return res.status(200).json({
      status: 'success',
      data: { companies },
    });
  } catch (error) {
    next(error);
  }
});

// GET /companies/:id - Get company detail (PUBLIC)
router.get('/:id', async (req, res, next) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: company,
    });
  } catch (error) {
    next(error);
  }
});

// POST /companies - Create company (PROTECTED)
router.post('/', authMiddleware, validate(companySchema), async (req, res, next) => {
  try {
    const { name, location, description } = req.body;
    const id = await companyService.addCompany({ name, location, description });

    return res.status(201).json({
      status: 'success',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /companies/:id - Update company (PROTECTED)
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { name, location, description } = req.body;
    await companyService.updateCompany(req.params.id, { name, location, description });

    return res.status(200).json({
      status: 'success',
      message: 'Company updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /companies/:id - Delete company (PROTECTED)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await companyService.deleteCompany(req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'Company deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
