import { useState } from "react";
export function CheckoutForm({ onSubmit, onCancel, submitting, serverError }) {
  const [values, setValues] = useState({ address: "", phone: "" });
  const [errors, setErrors] = useState({});
  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (values.address.trim().length < 8)
      next.address = "Enter a complete address";
    if (!/^\+?[0-9][0-9\s-]{8,14}$/.test(values.phone.trim()))
      next.phone = "Enter a valid phone number";
    setErrors(next);
    if (!Object.keys(next).length) onSubmit(values);
  };
  const field = (name, label, props = {}) => (
    <label>
      {label}
      <input
        value={values[name]}
        onChange={(e) => setValues({ ...values, [name]: e.target.value })}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <small id={`${name}-error`} className="error">
          {errors[name]}
        </small>
      )}
    </label>
  );
  return (
    <div className="modal-backdrop">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <span className="eyebrow">Almost there</span>
        <h2 id="checkout-title">Delivery details</h2>
        <p className="checkout-note">
          Your name is taken from your signed-in account.
        </p>
        <form onSubmit={submit} noValidate>
          {field("address", "Delivery address", {
            autoComplete: "street-address",
          })}
          {field("phone", "Phone number", {
            autoComplete: "tel",
            inputMode: "tel",
          })}
          {serverError && (
            <p role="alert" className="error-panel">
              {serverError}
            </p>
          )}
          <div className="actions">
            <button type="button" className="secondary" onClick={onCancel}>
              Back
            </button>
            <button className="primary" disabled={submitting}>
              {submitting ? "Placing…" : "Place order"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
