import { useState } from 'react';

export function MenuCard({ item, onAdd }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(item.image) && !imageFailed;

  return (
    <article className="menu-card">
      <div className="menu-image-wrap">
        {hasImage ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="menu-image-fallback" role="img" aria-label={`${item.name} image unavailable`}>
            <span>{item.name?.charAt(0) || 'Q'}</span>
          </div>
        )}
        <div className="menu-image-shade" aria-hidden="true" />
        <span className="category-chip">{item.category}</span>
        <span className="made-to-order-chip">Made to order</span>
      </div>
      <div className="menu-card-content">
        <div className="menu-card-title">
          <h3>{item.name}</h3>
          <span aria-hidden="true">✦</span>
        </div>
        <p className="menu-description">{item.description}</p>
        <footer className="menu-card-footer">
          <div className="menu-price">
            <small>Price</small>
            <strong>₹{item.price.toFixed(2)}</strong>
          </div>
          <button className="add-button" onClick={() => onAdd(item)} aria-label={`Add ${item.name} to cart`}>
            <span aria-hidden="true">+</span> Add to cart
          </button>
        </footer>
      </div>
    </article>
  );
}
