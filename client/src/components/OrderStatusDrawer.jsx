import { useState } from "react";
import { OrderTracker } from "./OrderTracker.jsx";

const terminalStatuses = ["Delivered", "Cancelled"];

export function OrderStatusDrawer({ order, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  const canDismiss = terminalStatuses.includes(order.status);
  const displayStatus =
    order.status === "Placed" ? "Order Received" : order.status;

  return (
    <section
      className={`order-drawer ${expanded ? "expanded" : ""}`}
      aria-label="Current order status"
    >
      <button
        className="order-drawer-handle"
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
      >
        <span className="live-dot" />
        <span className="drawer-summary">
          <small>Order #{order._id.slice(-6).toUpperCase()}</small>
          <strong>{displayStatus}</strong>
        </span>
        <span className="drawer-hint">
          {expanded ? "Collapse ↓" : "Track order ↑"}
        </span>
      </button>

      <div className="order-drawer-content" aria-hidden={!expanded}>
        <OrderTracker order={order} />
        {canDismiss && (
          <button className="secondary drawer-dismiss" onClick={onDismiss}>
            Close order
          </button>
        )}
      </div>
    </section>
  );
}
