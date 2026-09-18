import 'dotenv/config';
import mysql from 'mysql2/promise';

/**
 * Validate required environment variables for DB connection.
 * Throws an error if any variable is missing so the app fails fast.
 */
function validateEnv() {
  const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing DB env vars: ${missing.join(', ')}`);
  }
}

validateEnv();

/**
 * MySQL connection pool.
 * @type {import('mysql2/promise').Pool}
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  charset: 'utf8mb4',
});

/**
 * Test the DB connection on startup.
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log(`Database connected: ${process.env.DB_NAME}`);
    conn.release();
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
}

/**
 * Helper to retrieve the pool for injection.
 * @returns {import('mysql2/promise').Pool}
 */
function getPool() {
  return pool;
}

export { pool, getPool, testConnection };
