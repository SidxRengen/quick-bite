import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api.js";
import { useSnackbar } from "../context/SnackbarContext.jsx";
import { useOrderUpdates } from "./useOrderUpdates.js";

const ACTIVE_STATUSES = [
  "Placed",
  "Order Received",
  "Preparing",
  "Out for Delivery",
];

export function useCurrentOrder() {
  const [order, setOrder] = useState(null);
  const currentStatus = useRef(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    api
      .orders()
      .then((orders) => {
        const activeOrder =
          orders.find((item) => ACTIVE_STATUSES.includes(item.status)) || null;
        currentStatus.current = activeOrder?.status || null;
        setOrder(activeOrder);
      })
      .catch(() => setOrder(null));
  }, []);

  const setCurrentOrder = useCallback((nextOrder) => {
    currentStatus.current = nextOrder?.status || null;
    setOrder(nextOrder);
  }, []);

  const updateOrder = useCallback(
    (updatedOrder) => {
      if (
        currentStatus.current &&
        currentStatus.current !== updatedOrder.status
      ) {
        const status =
          updatedOrder.status === "Placed"
            ? "Order Received"
            : updatedOrder.status;
        showSnackbar(`Your order is now ${status}`, {
          variant: status === "Cancelled" ? "error" : "success",
        });
      }
      currentStatus.current = updatedOrder.status;
      setOrder(updatedOrder);
    },
    [showSnackbar],
  );
  useOrderUpdates(order?._id, updateOrder);

  return {
    order,
    setOrder: setCurrentOrder,
    dismiss: () => setCurrentOrder(null),
  };
}
