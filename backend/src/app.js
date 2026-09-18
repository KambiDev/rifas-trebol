import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { testConnection } from './config/db.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-ID'],
}));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', apiLimiter, authRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'rifas-trebol-api', version: '1.0.0' });
});

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await testConnection();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();

export default app;