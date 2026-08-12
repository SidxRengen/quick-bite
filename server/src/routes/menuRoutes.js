import { Router } from 'express';
import { listAdminMenu, listMenu, patchMenuItem, postMenuItem, removeMenuItem } from '../controllers/menuController.js';
import { authenticateRestaurant } from '../middleware/authenticateRestaurant.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

export const menuRoutes = Router();
menuRoutes.get('/admin', authenticateRestaurant, listAdminMenu);
menuRoutes.route('/').get(listMenu).post(authenticateRestaurant, postMenuItem);
menuRoutes.route('/:id')
  .patch(authenticateRestaurant, validateObjectId, patchMenuItem)
  .delete(authenticateRestaurant, validateObjectId, removeMenuItem);
