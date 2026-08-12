const nextStatus = {
  Placed: 'Preparing',
  'Order Received': 'Preparing',
  Preparing: 'Out for Delivery',
  'Out for Delivery': 'Delivered',
};

const actionLabels = {
  Preparing: 'Start preparing',
  'Out for Delivery': 'Send for delivery',
  Delivered: 'Mark delivered',
};

export function RestaurantOrderCard({ order, updating, onUpdateStatus }) {
  const next = nextStatus[order.status];
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <article className={`restaurant-order status-${order.status.toLowerCase().replaceAll(' ', '-')}`}>
      <div className="restaurant-order-topline">
        <div>
          <span className="order-number">#{order._id.slice(-6).toUpperCase()}</span>
          <span className="order-time">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <span className="restaurant-status">{order.status === 'Placed' ? 'Order Received' : order.status}</span>
      </div>

      <div className="restaurant-customer">
        <div className="customer-avatar">{order.customer.name.charAt(0).toUpperCase()}</div>
        <div><h3>{order.customer.name}</h3><p>{order.customer.address}</p><a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a></div>
      </div>

      <ul className="restaurant-items">
        {order.items.map((item) => (
          <li key={`${order._id}-${item.menuItem}`}><strong>{item.quantity}×</strong><span>{item.name}</span><span>₹{(item.price * item.quantity).toFixed(2)}</span></li>
        ))}
      </ul>

      <div className="restaurant-order-footer">
        <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
        <strong>₹{order.total.toFixed(2)}</strong>
        {next && (
          <button className="primary" disabled={updating} onClick={() => onUpdateStatus(order._id, next)}>
            {updating ? 'Updating…' : actionLabels[next]}
          </button>
        )}
      </div>
    </article>
  );
}
