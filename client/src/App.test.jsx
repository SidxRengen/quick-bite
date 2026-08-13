import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "./App.jsx";
import { api, RESTAURANT_TOKEN_KEY } from "./api.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SnackbarProvider } from "./context/SnackbarContext.jsx";

vi.mock("./api.js", () => ({
  RESTAURANT_TOKEN_KEY: "quickbite_restaurant_token",
  api: {
    me: vi.fn(),
    menu: vi.fn(),
    orders: vi.fn(),
    createOrder: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    adminMenu: vi.fn(),
    createMenuItem: vi.fn(),
    updateMenuItem: vi.fn(),
    deleteMenuItem: vi.fn(),
    restaurantLogin: vi.fn(),
    restaurantOrders: vi.fn(),
    updateRestaurantOrderStatus: vi.fn(),
  },
}));
vi.mock("socket.io-client", () => ({
  io: vi.fn(() => ({ emit: vi.fn(), on: vi.fn(), disconnect: vi.fn() })),
}));

const menuItem = {
  _id: "item-1",
  name: "Test Pizza",
  description: "Fresh test pizza",
  price: 250,
  image: "https://example.com/pizza.jpg",
  category: "Pizza",
};

describe("customer cart flow", () => {
  beforeEach(() => {
    localStorage.setItem("quickbite_token", "test-token");
    localStorage.removeItem(RESTAURANT_TOKEN_KEY);
    api.me.mockResolvedValue({
      user: { id: "user-1", name: "Ada", email: "ada@example.com" },
    });
    api.menu.mockResolvedValue([menuItem]);
    api.orders.mockResolvedValue([]);
  });

  it("adds an item and increases its quantity", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SnackbarProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SnackbarProvider>
      </MemoryRouter>,
    );
    await userEvent.click(
      await screen.findByRole("button", { name: "Add Test Pizza to cart" }),
    );
    expect(screen.getByLabelText("Test Pizza quantity")).toHaveTextContent("1");
    await userEvent.click(
      screen.getByRole("button", { name: "Increase Test Pizza" }),
    );
    expect(screen.getByLabelText("Test Pizza quantity")).toHaveTextContent("2");
    expect(screen.getByText("₹500.00")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /admin/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /restaurant/i }),
    ).not.toBeInTheDocument();
  });

  it("redirects the old admin route into restaurant access", async () => {
    localStorage.removeItem("quickbite_token");
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <SnackbarProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SnackbarProvider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "Restaurant access" }),
    ).toBeInTheDocument();
  });

  it("shows orders and menu management inside the restaurant workspace", async () => {
    localStorage.removeItem("quickbite_token");
    localStorage.setItem(RESTAURANT_TOKEN_KEY, "restaurant-token");
    api.restaurantOrders.mockResolvedValue([]);
    api.adminMenu.mockResolvedValue([]);
    render(
      <MemoryRouter initialEntries={["/restaurant"]}>
        <SnackbarProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SnackbarProvider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "Restaurant orders" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/kitchen is all caught up/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /customer app/i }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Menu management" }),
    );
    expect(
      await screen.findByRole("heading", { name: "Add menu item" }),
    ).toBeInTheDocument();
  });
});
