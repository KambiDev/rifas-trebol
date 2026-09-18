import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:               process.env.DB_HOST || 'localhost',
  port:               parseInt(process.env.DB_PORT || '3306'),
  user:               process.env.DB_USER || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME || 'rifas_trebol',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '+00:00',
  charset:            'utf8mb4',
});

async function testConnection() {
  const conn = await pool.getConnection();
  console.log(`Database connected: ${process.env.DB_NAME}`);
  conn.release();
}

export { pool, testConnection };
