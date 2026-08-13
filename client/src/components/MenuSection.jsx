import { MenuCard } from "./MenuCard.jsx";

export function MenuSection({ items, loading, error, onAdd, onRetry }) {
  return (
    <section id="menu">
      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Made fresh today</span>
          <h1>
            Fresh food,
            <br />
            <em>made simple.</em>
          </h1>
          <p>
            Choose your favourites, order in seconds, and follow every kitchen
            update live.
          </p>
          <div className="hero-points">
            <span>✓ Fresh ingredients</span>
            <span>✓ Live tracking</span>
            <span>✓ Fast delivery</span>
          </div>
        </div>
        <div className="hero-visual">
          <span className="hero-leaf">✦</span>
          <strong>
            Good food.
            <br />
            Good mood.
          </strong>
          <small>Prepared after you order</small>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">Explore</span>
          <h2>Today’s menu</h2>
        </div>
        <span className="dish-count">{items.length} dishes</span>
      </div>

      {loading && <p role="status">Loading menu…</p>}
      {error && (
        <p role="alert" className="error-panel">
          {error} <button onClick={onRetry}>Retry</button>
        </p>
      )}
      {!loading && !error && items.length === 0 && (
        <p className="empty-menu">No menu items are currently available.</p>
      )}

      <div className="menu-grid">
        {items.map((item) => (
          <MenuCard key={item._id} item={item} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
