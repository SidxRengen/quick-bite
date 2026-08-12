export const ORDER_STATUSES = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
export const ORDER_STATUS_VALUES = ['Placed', ...ORDER_STATUSES];
export const RESTAURANT_STATUS_FLOW = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

export const normalizeOrderStatus = (status) => status === 'Placed' ? 'Order Received' : status;
