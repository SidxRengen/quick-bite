export function Cart({ items, total, onChange, onCheckout }) {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <aside className="cart" aria-labelledby="cart-title">
      <div className="section-heading cart-heading">
        <div><span className="eyebrow">Your order</span><h2 id="cart-title">Cart</h2></div>
        <span className="badge">{itemCount}</span>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart"><span>🥬</span><p>Your cart is empty.</p><small>Add something fresh from the menu.</small></div>
      ) : (
        <>
          <ul className="cart-items">
            {items.map((item) => (
              <li key={item._id}>
                <div className="cart-item-copy"><strong>{item.name}</strong><small>₹{item.price.toFixed(2)} each</small></div>
                <div className="quantity">
                  <button aria-label={`Decrease ${item.name}`} onClick={() => onChange(item._id, item.quantity - 1)}>−</button>
                  <output aria-label={`${item.name} quantity`}>{item.quantity}</output>
                  <button aria-label={`Increase ${item.name}`} onClick={() => onChange(item._id, item.quantity + 1)}>+</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div>
          <button className="primary wide checkout-button" onClick={onCheckout}>Continue to checkout <span>→</span></button>
        </>
      )}
    </aside>
  );
}
