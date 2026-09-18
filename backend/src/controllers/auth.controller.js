import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from '../config/db.js';

/**
 * Login endpoint.
 * Validates credentials, generates JWT, and checks if device is registered.
 */
export const login = async (req, res) => {
  const { username, password, device_id } = req.body;

  try {
    const pool = getPool();

    // 1. Find user by username
    const [users] = await pool.query(
      'SELECT id, name, username, password_hash, role, active FROM usuarios WHERE username = ? LIMIT 1',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // 2. Check if account is active
    if (!user.active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Check if device is registered
    let deviceRegistered = false;
    if (device_id) {
      const [devices] = await pool.query(
        'SELECT id FROM authorized_devices WHERE user_id = ? AND device_id = ? LIMIT 1',
        [user.id, device_id]
      );
      deviceRegistered = devices.length > 0;
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // 6. Respond
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
      device_registered: deviceRegistered,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
};
