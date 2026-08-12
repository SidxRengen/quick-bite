import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 8008,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quickbite',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'quickbite-test-secret-only' : ''),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  restaurantAccessKey: process.env.RESTAURANT_ACCESS_KEY || (process.env.NODE_ENV === 'test' ? 'restaurant-test-key' : ''),
};
