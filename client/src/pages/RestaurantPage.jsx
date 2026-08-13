import { useMemo, useState } from "react";
import { api, RESTAURANT_TOKEN_KEY } from "../api.js";
import { AdminPanel } from "../components/AdminPanel.jsx";
import { RestaurantAccessForm } from "../components/restaurant/RestaurantAccessForm.jsx";
import { RestaurantOrderCard } from "../components/restaurant/RestaurantOrderCard.jsx";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { useRestaurantOrders } from "../hooks/useRestaurantOrders.js";
import { useSnackbar } from "../context/SnackbarContext.jsx";

const activeStatuses = [
  "Placed",
  "Order Received",
  "Preparing",
  "Out for Delivery",
];

export function RestaurantPage() {
  const [authenticated, setAuthenticated] = useState(
    Boolean(localStorage.getItem(RESTAURANT_TOKEN_KEY)),
  );
  const restaurant = useRestaurantOrders(authenticated);
  const [section, setSection] = useState("orders");
  const [view, setView] = useState("active");
  const { showSnackbar } = useSnackbar();
  const visibleOrders = useMemo(
    () =>
      restaurant.orders.filter((order) =>
        view === "active"
          ? activeStatuses.includes(order.status)
          : !activeStatuses.includes(order.status),
      ),
    [restaurant.orders, view],
  );
  const newCount = restaurant.orders.filter((order) =>
    ["Placed", "Order Received"].includes(order.status),
  ).length;

  const login = async (accessKey) => {
    const response = await api.restaurantLogin(accessKey);
    localStorage.setItem(RESTAURANT_TOKEN_KEY, response.token);
    setAuthenticated(true);
    showSnackbar("Restaurant workspace opened", { variant: "success" });
  };

  const logout = () => {
    localStorage.removeItem(RESTAURANT_TOKEN_KEY);
    setAuthenticated(false);
    showSnackbar("Signed out of restaurant workspace", { variant: "info" });
  };

  if (!authenticated) return <RestaurantAccessForm onSubmit={login} />;

  return (
    <>
      <SiteHeader mode="restaurant" onLogout={logout} />
      <main className="restaurant-page">
        <section className="restaurant-hero">
          <div>
            <span className="eyebrow">Live kitchen board</span>
            <h1>Restaurant orders</h1>
            <p>
              New customer orders arrive here instantly. Move each order through
              the kitchen and delivery workflow.
            </p>
          </div>
          <div className="kitchen-stats">
            <strong>{newCount}</strong>
            <span>waiting to prepare</span>
          </div>
        </section>

        <div
          className="segment-control staff-section-tabs"
          aria-label="Restaurant section"
        >
          <button
            className={section === "orders" ? "active" : ""}
            onClick={() => setSection("orders")}
          >
            Orders
          </button>
          <button
            className={section === "menu" ? "active" : ""}
            onClick={() => setSection("menu")}
          >
            Menu management
          </button>
        </div>

        {section === "orders" ? (
          <>
            <div className="restaurant-toolbar">
              <div className="segment-control" aria-label="Order view">
                <button
                  className={view === "active" ? "active" : ""}
                  onClick={() => setView("active")}
                >
                  Active orders
                </button>
                <button
                  className={view === "completed" ? "active" : ""}
                  onClick={() => setView("completed")}
                >
                  Completed
                </button>
              </div>
              <button className="secondary" onClick={restaurant.reload}>
                Refresh
              </button>
            </div>

            {restaurant.error && (
              <p role="alert" className="error-panel">
                {restaurant.error}
              </p>
            )}
            {restaurant.loading && (
              <p role="status">Loading restaurant orders…</p>
            )}
            {!restaurant.loading && visibleOrders.length === 0 && (
              <div className="restaurant-empty">
                <span>✓</span>
                <h2>
                  {view === "active"
                    ? "Kitchen is all caught up"
                    : "No completed orders yet"}
                </h2>
                <p>New orders will appear automatically.</p>
              </div>
            )}

            <section className="restaurant-grid" aria-label={`${view} orders`}>
              {visibleOrders.map((order) => (
                <RestaurantOrderCard
                  key={order._id}
                  order={order}
                  updating={restaurant.updatingId === order._id}
                  onUpdateStatus={restaurant.updateStatus}
                />
              ))}
            </section>
          </>
        ) : (
          <AdminPanel embedded />
        )}
      </main>
    </>
  );
}
