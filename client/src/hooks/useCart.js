import { useMemo, useState } from "react";
export function useCart() {
  const [items, setItems] = useState([]);
  const add = (item) =>
    setItems((current) => {
      const found = current.find((x) => x._id === item._id);
      return found
        ? current.map((x) =>
            x._id === item._id
              ? { ...x, quantity: Math.min(x.quantity + 1, 99) }
              : x,
          )
        : [...current, { ...item, quantity: 1 }];
    });
  const change = (id, quantity) =>
    setItems((current) =>
      quantity <= 0
        ? current.filter((x) => x._id !== id)
        : current.map((x) =>
            x._id === id ? { ...x, quantity: Math.min(quantity, 99) } : x,
          ),
    );
  const clear = () => setItems([]);
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  return { items, add, change, clear, total };
}
