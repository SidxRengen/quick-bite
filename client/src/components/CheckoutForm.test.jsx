import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckoutForm } from "./CheckoutForm.jsx";
describe("CheckoutForm", () => {
  it("uses the authenticated name and submits delivery details", async () => {
    const onSubmit = vi.fn();
    render(
      <CheckoutForm
        onSubmit={onSubmit}
        onCancel={() => {}}
        submitting={false}
      />,
    );
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/name is taken from your signed-in account/i),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));
    expect(screen.getByText(/complete address/i)).toBeInTheDocument();
    await userEvent.type(
      screen.getByLabelText(/delivery address/i),
      "12 Computing Lane",
    );
    await userEvent.type(screen.getByLabelText(/phone number/i), "9876543210");
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      address: "12 Computing Lane",
      phone: "9876543210",
    });
  });
});
