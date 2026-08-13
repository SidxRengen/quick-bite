import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useSnackbar } from "../context/SnackbarContext.jsx";
import { MenuItemForm } from "./admin/MenuItemForm.jsx";
import { MenuItemList } from "./admin/MenuItemList.jsx";

const EMPTY_ITEM = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  available: true,
};

const toEditableItem = (item) => ({
  name: item.name,
  description: item.description,
  price: String(item.price),
  image: item.image,
  category: item.category,
  available: item.available,
});

export function AdminPanel({ embedded = false }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_ITEM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { showSnackbar } = useSnackbar();

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await api.adminMenu());
    } catch (requestError) {
      setError(requestError.message);
      showSnackbar(requestError.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const resetForm = () => {
    setForm(EMPTY_ITEM);
    setEditingId(null);
    setError("");
  };

  const editItem = (item) => {
    setEditingId(item._id);
    setForm(toEditableItem(item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveItem = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = { ...form, price: Number(form.price) };
    try {
      const message = editingId ? "Menu item updated" : "Menu item added";
      if (editingId) await api.updateMenuItem(editingId, payload);
      else await api.createMenuItem(payload);
      resetForm();
      await loadItems();
      showSnackbar(message, { variant: "success" });
    } catch (requestError) {
      setError(requestError.message);
      showSnackbar(requestError.message, { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (item) => {
    setError("");
    try {
      await api.updateMenuItem(item._id, { available: !item.available });
      await loadItems();
      showSnackbar(
        `${item.name} is now ${item.available ? "hidden" : "available"}`,
        { variant: "success" },
      );
    } catch (requestError) {
      setError(requestError.message);
      showSnackbar(requestError.message, { variant: "error" });
    }
  };

  const deleteItem = async (item) => {
    const confirmed = window.confirm(
      `Delete ${item.name}? Existing orders will keep their saved item details.`,
    );
    if (!confirmed) return;

    setError("");
    try {
      await api.deleteMenuItem(item._id);
      if (editingId === item._id) resetForm();
      await loadItems();
      showSnackbar(`${item.name} deleted`, { variant: "success" });
    } catch (requestError) {
      setError(requestError.message);
      showSnackbar(requestError.message, { variant: "error" });
    }
  };

  return (
    <section
      className={`admin-page ${embedded ? "embedded-admin" : ""}`}
      aria-label="Menu management"
    >
      <MenuItemForm
        value={form}
        editing={Boolean(editingId)}
        saving={saving}
        error={error}
        onChange={setForm}
        onSubmit={saveItem}
        onCancel={resetForm}
      />
      <MenuItemList
        items={items}
        loading={loading}
        onEdit={editItem}
        onToggleAvailability={toggleAvailability}
        onDelete={deleteItem}
      />
    </section>
  );
}
