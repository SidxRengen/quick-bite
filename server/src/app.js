import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { menuRoutes } from './routes/menuRoutes.js';
import { orderRoutes } from './routes/orderRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { env } from './config/env.js';
import { getHealth } from './controllers/healthController.js';
import { authRoutes } from './routes/authRoutes.js';
import { restaurantRoutes } from './routes/restaurantRoutes.js';

export const createApp = () => {
  const app = express();
  app.use(helmet()); app.use(cors({ origin: env.clientOrigin })); app.use(express.json({ limit: '20kb' }));
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
  app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));
  app.get('/api/health', getHealth);
  app.use('/api/auth', authRoutes); app.use('/api/menu', menuRoutes); app.use('/api/orders', orderRoutes); app.use('/api/restaurant', restaurantRoutes); app.use(notFound); app.use(errorHandler);
  return app;
};
