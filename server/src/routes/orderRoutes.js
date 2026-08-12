import { Router } from 'express';
import { deleteOrder, getOrder, listOrders, patchOrderStatus, postOrder } from '../controllers/orderController.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import { authenticate } from '../middleware/authenticate.js';
export const orderRoutes = Router();
orderRoutes.use(authenticate);
orderRoutes.route('/').get(listOrders).post(postOrder);
orderRoutes.route('/:id').get(validateObjectId, getOrder).delete(validateObjectId, deleteOrder);
orderRoutes.patch('/:id/status', validateObjectId, patchOrderStatus);
