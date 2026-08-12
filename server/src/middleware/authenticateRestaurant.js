import { HttpError } from '../utils/httpError.js';
import { verifyToken } from '../utils/token.js';

export const authenticateRestaurant = (req, res, next) => {
  try {
    const authorization = req.get('authorization') || '';
    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) throw new HttpError(401, 'Restaurant authentication required');
    const payload = verifyToken(token);
    if (payload.role !== 'restaurant') throw new HttpError(403, 'Restaurant access required');
    next();
  } catch (error) {
    if (error instanceof HttpError) return next(error);
    next(new HttpError(401, 'Invalid or expired restaurant token'));
  }
};
