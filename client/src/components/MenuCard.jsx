export function MenuCard({ item, onAdd }) {
  return (
    <article className="menu-card">
      <div className="menu-image-wrap">
        <img src={item.image} alt="" loading="lazy" />
        <span className="category-chip">{item.category}</span>
      </div>
      <div className="menu-card-content">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <footer>
          <strong>₹{item.price.toFixed(2)}</strong>
          <button className="add-button" onClick={() => onAdd(item)} aria-label={`Add ${item.name} to cart`}>
            <span>+</span> Add
          </button>
        </footer>
      </div>
    </article>
  );
}
