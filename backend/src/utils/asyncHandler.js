/**
 * Wraps an async Express handler so rejected promises are forwarded to the
 * global error handler instead of crashing or hanging.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};