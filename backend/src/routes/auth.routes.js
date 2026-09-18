import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { login } from '../controllers/auth.controller.js';

const router = Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('device_id').notEmpty().withMessage('Device ID is required'),
  ],
  validateRequest,
  login
);

export default router;
