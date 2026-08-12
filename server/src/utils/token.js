import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const createToken = (userId) => jwt.sign({ sub: String(userId) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
export const createRestaurantToken = () => jwt.sign({ sub: 'restaurant', role: 'restaurant' }, env.jwtSecret, { expiresIn: '12h' });
export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
