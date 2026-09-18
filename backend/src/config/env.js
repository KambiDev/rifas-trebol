import 'dotenv/config';

const REQUIRED_ENV = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];

/**
 * Validate required environment variables.
 * Throws an error if any variable is missing so the app fails fast.
 */
export function validateEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }
}