import { getPool } from '../config/db.js';

/**
 * Middleware to check if the device ID provided in the header
 * is linked to the authenticated user.
 * Must be used AFTER verifyToken.
 */
export const checkDevice = async (req, res, next) => {
  const deviceId = req.headers['x-device-id'];

  if (!deviceId) {
    return res.status(400).json({ error: 'Missing X-Device-ID header' });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id FROM authorized_devices WHERE user_id = ? AND device_id = ? LIMIT 1',
      [req.user.id, deviceId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: 'Device not authorized for this user' });
    }

    next();
  } catch (error) {
    console.error('Error in checkDevice middleware:', error);
    return res.status(500).json({ error: 'Internal server error validating device' });
  }
};
