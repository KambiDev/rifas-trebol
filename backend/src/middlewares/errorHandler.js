import { AppError, ValidationError } from '../utils/errors.js';

export const notFoundHandler = (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err instanceof ValidationError && err.errors ? { errors: err.errors } : {}),
    });
  }

  console.error(err);

  const message =
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(500).json({ error: message });
};