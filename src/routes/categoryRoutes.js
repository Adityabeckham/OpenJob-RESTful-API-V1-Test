const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { categorySchema } = require('../validators/categoryValidator');
const categoryService = require('../services/CategoryService');

// GET /categories - List all categories (PUBLIC)
router.get('/', async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();

    return res.status(200).json({
      status: 'success',
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
});

// GET /categories/:id - Get category detail (PUBLIC)
router.get('/:id', async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

// POST /categories - Create category (PROTECTED)
router.post('/', authMiddleware, validate(categorySchema), async (req, res, next) => {
  try {
    const { name } = req.body;
    const id = await categoryService.addCategory({ name });

    return res.status(201).json({
      status: 'success',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /categories/:id - Update category (PROTECTED)
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { name } = req.body;
    await categoryService.updateCategory(req.params.id, { name });

    return res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /categories/:id - Delete category (PROTECTED)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
