import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';
import { verifyToken } from '../utils/token.js';

export const authenticate = async (req, res, next) => {
  try {
    const authorization = req.get('authorization') || '';
    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) throw new HttpError(401, 'Authentication required');
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) throw new HttpError(401, 'Authentication required');
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof HttpError) return next(error);
    next(new HttpError(401, 'Invalid or expired token'));
  }
};
