import { MenuItem } from '../models/MenuItem.js';
import { Order } from '../models/Order.js';
import { normalizeOrderStatus, RESTAURANT_STATUS_FLOW } from '../constants/order.js';
import { HttpError } from '../utils/httpError.js';

const clean = (value) => typeof value === 'string' ? value.trim() : '';
const validateDeliveryDetails = (customer = {}) => {
  const errors = {};
  if (clean(customer.address).length < 8) errors.address = 'Address must contain at least 8 characters';
  if (!/^\+?[0-9][0-9\s-]{8,14}$/.test(clean(customer.phone))) errors.phone = 'Enter a valid phone number';
  if (Object.keys(errors).length) throw new HttpError(400, 'Invalid customer details', errors);
  return { address: clean(customer.address), phone: clean(customer.phone) };
};

export async function createOrder(payload = {}, user) {
  const deliveryDetails = validateDeliveryDetails(payload.customer);
  const customer = { name: user.name, ...deliveryDetails };
  if (!Array.isArray(payload.items) || payload.items.length === 0) throw new HttpError(400, 'Order must contain at least one item');
  const quantities = new Map();
  for (const item of payload.items) {
    if (!item?.menuItemId || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) throw new HttpError(400, 'Each item requires a valid menuItemId and quantity from 1 to 99');
    quantities.set(String(item.menuItemId), (quantities.get(String(item.menuItemId)) || 0) + item.quantity);
  }
  const menuItems = await MenuItem.find({ _id: { $in: [...quantities.keys()] }, available: true });
  if (menuItems.length !== quantities.size) throw new HttpError(400, 'One or more menu items are invalid or unavailable');
  const items = menuItems.map((item) => ({ menuItem: item._id, name: item.name, price: item.price, quantity: quantities.get(String(item._id)) }));
  const total = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  return Order.create({ user: user.id, customer, items, total, statusHistory: [{ status: 'Order Received' }] });
}

export async function cancelOrder(id, status, userId) {
  if (status !== 'Cancelled') throw new HttpError(403, 'Customers can only cancel an order');
  const order = await Order.findOne({ _id: id, user: userId });
  if (!order) throw new HttpError(404, 'Order not found');
  if (!['Order Received', 'Placed'].includes(order.status)) throw new HttpError(409, 'An order can only be cancelled before preparation starts');
  order.status = 'Cancelled'; order.statusHistory.push({ status: 'Cancelled' });
  return order.save();
}

export async function updateRestaurantOrderStatus(id, status) {
  if (!RESTAURANT_STATUS_FLOW.slice(1).includes(status)) {
    throw new HttpError(400, `Restaurant status must be one of: ${RESTAURANT_STATUS_FLOW.slice(1).join(', ')}`);
  }

  const order = await Order.findById(id);
  if (!order) throw new HttpError(404, 'Order not found');
  if (order.status === 'Cancelled') throw new HttpError(409, 'A cancelled order cannot be updated');
  if (order.status === 'Delivered') throw new HttpError(409, 'A delivered order cannot be updated');

  const currentStatus = normalizeOrderStatus(order.status);
  const expectedStatus = RESTAURANT_STATUS_FLOW[RESTAURANT_STATUS_FLOW.indexOf(currentStatus) + 1];
  if (status !== expectedStatus) throw new HttpError(409, `Next status must be ${expectedStatus}`);

  order.status = status;
  order.statusHistory.push({ status });
  return order.save();
}
