import * as authService from '../services/auth.service.js';

export const login = async (req, res) => {
  const data = await authService.login(req.body);
  return res.json(data);
};

export const registerDevice = async (req, res) => {
  await authService.registerDevice(req.body);
  return res.status(201).json({ message: 'Device registered successfully' });
};

export const listDevices = async (req, res) => {
  const devices = await authService.listDevices(req.params.id);
  return res.json(devices);
};

export const revokeDevice = async (req, res) => {
  await authService.revokeDevice(req.params.id);
  return res.json({ message: 'Device revoked successfully' });
};