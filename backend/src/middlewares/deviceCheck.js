import { ForbiddenError, UnauthorizedError, ValidationError } from '../utils/errors.js';
import { findDevice } from '../repositories/auth.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Middleware to check if the device ID provided in the header
 * is linked to the authenticated user.
 * Must be used AFTER verifyToken.
 */
export const checkDevice = asyncHandler(async (req, _res, next) => {
  const deviceId = req.headers['x-device-id'];

  if (!deviceId) {
    return next(new ValidationError('Missing X-Device-ID header'));
  }

  if (!req.user || !req.user.id) {
    return next(new UnauthorizedError('Authentication required'));
  }

  const device = await findDevice(req.user.id, deviceId);
  if (!device) {
    return next(new ForbiddenError('Device not authorized for this user'));
  }
  next();
});