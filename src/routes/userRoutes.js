const express = require('express');
const router = express.Router();
const validate = require('../middleware/validationMiddleware');
const { registerUserSchema } = require('../validators/userValidator');
const userService = require('../services/UserService');

// POST /users - Register new user (PUBLIC)
router.post('/', validate(registerUserSchema), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const id = await userService.addUser({ name, email, password, role });

    return res.status(201).json({
      status: 'success',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
});

// GET /users/:id - Get user profile by ID (PUBLIC)
router.get('/:id', async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
