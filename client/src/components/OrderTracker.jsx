const steps = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

const statusMessages = {
  'Order Received': 'The restaurant has received your order.',
  Preparing: 'Your meal is being freshly prepared.',
  'Out for Delivery': 'Your order is on its way to you.',
  Delivered: 'Your order has been delivered. Enjoy!',
  Cancelled: 'This order was cancelled.',
};

export function OrderTracker({ order }) {
  const currentStep = steps.indexOf(order.status === 'Placed' ? 'Order Received' : order.status);

  return (
    <div className="order-tracker">
      <div className="tracker-heading">
        <div>
          <span className="eyebrow">Live order</span>
          <h2>{order.status}</h2>
          <p>{statusMessages[order.status] || statusMessages['Order Received']}</p>
        </div>
        <strong className="order-total">₹{order.total.toFixed(2)}</strong>
      </div>

      {order.status === 'Cancelled' ? (
        <p className="error-panel">This order was cancelled.</p>
      ) : (
        <ol className="status-timeline">
          {steps.map((step, index) => (
            <li className={index <= currentStep ? 'active' : ''} key={step}>
              <span>{index < currentStep ? '✓' : index + 1}</span>
              <div>
                <strong>{step}</strong>
                {index === currentStep && <small>Current status</small>}
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="order-meta">
        <span><small>Deliver to</small>{order.customer.address}</span>
        <span><small>Items</small>{order.items.reduce((count, item) => count + item.quantity, 0)}</span>
      </div>
      <p className="live"><i /> Updates appear here automatically</p>
    </div>
  );
}
