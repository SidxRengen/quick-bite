export function MenuItemList({
  items,
  loading,
  onEdit,
  onToggleAvailability,
  onDelete,
}) {
  return (
    <section className="admin-list" aria-labelledby="menu-items-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Inventory</span>
          <h2 id="menu-items-heading">Menu items</h2>
        </div>
        <span>{items.length} total</span>
      </div>

      {loading && <p role="status">Loading menu items…</p>}
      {!loading && items.length === 0 && (
        <div className="admin-empty">
          <h3>No menu items yet</h3>
          <p>
            Use the form above to add the first item, or run the seed command.
          </p>
        </div>
      )}

      <div className="admin-items">
        {items.map((item) => (
          <article className="admin-item" key={item._id}>
            <img src={item.image} alt="" />
            <div className="admin-item-copy">
              <div>
                <span className="eyebrow">{item.category}</span>
                <h3>{item.name}</h3>
              </div>
              <p>{item.description}</p>
              <strong>₹{item.price.toFixed(2)}</strong>
            </div>
            <div className="admin-item-actions">
              <span
                className={`status-pill ${item.available ? "available" : "unavailable"}`}
              >
                {item.available ? "Available" : "Hidden"}
              </span>
              <button className="secondary" onClick={() => onEdit(item)}>
                Edit
              </button>
              <button
                className="secondary"
                onClick={() => onToggleAvailability(item)}
              >
                {item.available ? "Hide" : "Show"}
              </button>
              <button className="danger" onClick={() => onDelete(item)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
