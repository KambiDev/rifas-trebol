import jwt from 'jsonwebtoken';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

/**
 * Middleware to verify JWT token from Authorization header.
 * Attaches the decoded payload to req.user.
 */
export const verifyToken = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('No token provided or invalid format'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

/**
 * Middleware factory to restrict access based on roles.
 * Must be used AFTER verifyToken.
 * @param  {...string} roles - Allowed roles (e.g. 'admin', 'vendor')
 */
export const requireRole = (...roles) => {
  return (req, _res, next) => {
    if (!req.user || !req.user.role) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};