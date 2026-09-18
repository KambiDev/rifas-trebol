import { getPool } from '../config/db.js';

export async function findUserByUsername(username) {
  const [rows] = await getPool().query(
    'SELECT id, name, username, password_hash, role, active FROM usuarios WHERE username = ? LIMIT 1',
    [username]
  );
  return rows[0] || null;
}

export async function findDevice(userId, deviceId) {
  const [rows] = await getPool().query(
    'SELECT id FROM authorized_devices WHERE user_id = ? AND device_id = ? LIMIT 1',
    [userId, deviceId]
  );
  return rows[0] || null;
}

export async function insertDevice(userId, deviceId) {
  await getPool().query(
    'INSERT INTO authorized_devices (user_id, device_id) VALUES (?, ?)',
    [userId, deviceId]
  );
}

export async function listDevicesForUser(userId) {
  const [rows] = await getPool().query(
    'SELECT id, device_id, linked_at FROM authorized_devices WHERE user_id = ?',
    [userId]
  );
  return rows;
}

export async function deleteDeviceById(recordId) {
  const [result] = await getPool().query('DELETE FROM authorized_devices WHERE id = ?', [recordId]);
  return result.affectedRows > 0;
}