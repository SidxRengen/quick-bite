import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api, RESTAURANT_TOKEN_KEY } from '../api.js';
import { useSnackbar } from '../context/SnackbarContext.jsx';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8008';

const replaceOrder = (orders, updatedOrder) => {
  const exists = orders.some((order) => order._id === updatedOrder._id);
  if (!exists) return [updatedOrder, ...orders];
  return orders.map((order) => order._id === updatedOrder._id ? updatedOrder : order);
};

export function useRestaurantOrders(enabled) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const { showSnackbar } = useSnackbar();

  const loadOrders = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError('');
    try { setOrders(await api.restaurantOrders()); }
    catch (requestError) { setError(requestError.message); showSnackbar(requestError.message, { variant: 'error' }); }
    finally { setLoading(false); }
  }, [enabled, showSnackbar]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  useEffect(() => {
    if (!enabled) return undefined;
    const socket = io(SOCKET_URL, { auth: { token: localStorage.getItem(RESTAURANT_TOKEN_KEY) } });
    socket.on('restaurant:order-created', (order) => {
      setOrders((current) => replaceOrder(current, order));
      showSnackbar(`New order #${order._id.slice(-6).toUpperCase()} from ${order.customer.name}`, { variant: 'info', duration: 6000 });
    });
    socket.on('restaurant:order-updated', (order) => setOrders((current) => replaceOrder(current, order)));
    return () => socket.disconnect();
  }, [enabled, showSnackbar]);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    setError('');
    try {
      const updatedOrder = await api.updateRestaurantOrderStatus(orderId, status);
      setOrders((current) => replaceOrder(current, updatedOrder));
      showSnackbar(`Order #${orderId.slice(-6).toUpperCase()} updated to ${status}`, { variant: 'success' });
    } catch (requestError) {
      setError(requestError.message);
      showSnackbar(requestError.message, { variant: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  return { orders, loading, error, updatingId, reload: loadOrders, updateStatus };
}
