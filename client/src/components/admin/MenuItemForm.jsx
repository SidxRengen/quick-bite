function TextField({ label, name, value, onChange, ...inputProps }) {
  return (
    <label>
      {label}
      <input
        required
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        {...inputProps}
      />
    </label>
  );
}

export function MenuItemForm({
  value,
  editing,
  saving,
  error,
  onChange,
  onSubmit,
  onCancel,
}) {
  const updateField = (name, fieldValue) =>
    onChange({ ...value, [name]: fieldValue });

  return (
    <section className="admin-form-card">
      <span className="eyebrow">Menu manager</span>
      <h1>{editing ? "Edit menu item" : "Add menu item"}</h1>
      <p className="admin-warning">
        Add dishes, update details and control what customers can order.
      </p>

      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <TextField
            label="Item name"
            name="name"
            value={value.name}
            onChange={updateField}
            maxLength={80}
          />
          <TextField
            label="Category"
            name="category"
            value={value.category}
            onChange={updateField}
            maxLength={50}
          />
          <TextField
            label="Price (₹)"
            name="price"
            value={value.price}
            onChange={updateField}
            type="number"
            min="0"
            max="100000"
            step="0.01"
          />
          <TextField
            label="Image URL"
            name="image"
            value={value.image}
            onChange={updateField}
            type="url"
          />
        </div>

        <label>
          Description
          <textarea
            required
            minLength={5}
            maxLength={300}
            value={value.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={value.available}
            onChange={(event) => updateField("available", event.target.checked)}
          />
          Available to customers
        </label>

        {value.image && (
          <img
            className="image-preview"
            src={value.image}
            alt="Menu item preview"
            onLoad={(event) => {
              event.currentTarget.style.display = "block";
            }}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        )}
        {error && (
          <p role="alert" className="error-panel">
            {error}
          </p>
        )}

        <div className="actions">
          {editing && (
            <button type="button" className="secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button className="primary" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save changes" : "Add item"}
          </button>
        </div>
      </form>
    </section>
  );
}
