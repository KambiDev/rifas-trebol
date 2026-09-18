import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from '../utils/errors.js';
import * as authRepository from '../repositories/auth.repository.js';

export async function login({ username, password, device_id: deviceId }) {
  const user = await authRepository.findUserByUsername(username);
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  if (!user.active) {
    throw new ForbiddenError('Account is deactivated');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  let deviceRegistered = false;
  if (deviceId) {
    deviceRegistered = !!(await authRepository.findDevice(user.id, deviceId));
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    },
    device_registered: deviceRegistered,
  };
}

export async function registerDevice({ user_id: userId, device_id: deviceId }) {
  if (await authRepository.findDevice(userId, deviceId)) {
    throw new ConflictError('Device is already registered for this user');
  }
  await authRepository.insertDevice(userId, deviceId);
}

export function listDevices(userId) {
  return authRepository.listDevicesForUser(userId);
}

export async function revokeDevice(recordId) {
  const deleted = await authRepository.deleteDeviceById(recordId);
  if (!deleted) {
    throw new NotFoundError('Device not found');
  }
}