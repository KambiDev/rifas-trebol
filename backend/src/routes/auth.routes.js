import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { login, registerDevice, listDevices, revokeDevice } from '../controllers/auth.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' },
});

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
  loginLimiter,
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('device_id').notEmpty().withMessage('Device ID is required'),
  ],
  validateRequest,
  asyncHandler(login)
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
  asyncHandler(registerDevice)
);

router.get(
  '/devices/:id',
  verifyToken,
  requireRole('admin'),
  asyncHandler(listDevices)
);

router.delete(
  '/devices/:id',
  verifyToken,
  requireRole('admin'),
  asyncHandler(revokeDevice)
);

export default router;