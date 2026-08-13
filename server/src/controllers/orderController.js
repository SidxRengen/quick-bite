import { Order } from "../models/Order.js";
import { cancelOrder, createOrder } from "../services/orderService.js";
import { HttpError } from "../utils/httpError.js";

export const listOrders = async (req, res, next) => {
  try {
    res.json(await Order.find({ user: req.user.id }).sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
};
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!order) throw new HttpError(404, "Order not found");
    res.json(order);
  } catch (e) {
    next(e);
  }
};
export const postOrder = async (req, res, next) => {
  try {
    const order = await createOrder(req.body, req.user);
    const io = req.app.get("io");
    io?.to("restaurant:orders").emit("restaurant:order-created", order);
    io?.to(`user:${req.user.id}`).emit("order:created", order);
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
};
export const patchOrderStatus = async (req, res, next) => {
  try {
    const order = await cancelOrder(
      req.params.id,
      req.body.status,
      req.user.id,
    );
    const io = req.app.get("io");
    io?.to(`order:${order.id}`).emit("order:updated", order);
    io?.to("restaurant:orders").emit("restaurant:order-updated", order);
    res.json(order);
  } catch (e) {
    next(e);
  }
};
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!order) throw new HttpError(404, "Order not found");
    if (order.status !== "Cancelled")
      throw new HttpError(409, "Only cancelled orders can be deleted");
    await order.deleteOne();
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
