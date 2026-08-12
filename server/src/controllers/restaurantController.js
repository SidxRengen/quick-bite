import { Order } from '../models/Order.js';
import { updateRestaurantOrderStatus } from '../services/orderService.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
import { createRestaurantToken } from '../utils/token.js';

export const loginRestaurant = (req, res, next) => {
  try {
    if (!env.restaurantAccessKey || req.body.accessKey !== env.restaurantAccessKey) {
      throw new HttpError(401, 'Invalid restaurant access key');
    }
    res.json({ token: createRestaurantToken() });
  } catch (error) {
    next(error);
  }
};

export const listRestaurantOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const patchRestaurantOrderStatus = async (req, res, next) => {
  try {
    const order = await updateRestaurantOrderStatus(req.params.id, req.body.status);
    const io = req.app.get('io');
    io?.to(`order:${order.id}`).emit('order:updated', order);
    io?.to(`user:${order.user}`).emit('order:updated', order);
    io?.to('restaurant:orders').emit('restaurant:order-updated', order);
    res.json(order);
  } catch (error) {
    next(error);
  }
};
