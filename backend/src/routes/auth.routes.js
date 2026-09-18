import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { login, registerDevice, listDevices, revokeDevice } from '../controllers/auth.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --- Public Routes ---
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

// --- Protected Routes (Admin only) ---
router.post(
  '/register-device',
  verifyToken,
  requireRole('admin'),
  [
    body('user_id').isInt().withMessage('Valid user_id is required'),
    body('device_id').notEmpty().withMessage('Device ID is required'),
  ],
  validateRequest,
  registerDevice
);

router.get(
  '/devices/:user_id',
  verifyToken,
  requireRole('admin'),
  listDevices
);

router.delete(
  '/devices/:device_id',
  verifyToken,
  requireRole('admin'),
  revokeDevice
);

export default router;
