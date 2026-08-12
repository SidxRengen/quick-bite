import { useState } from 'react';
import { api } from '../api.js';
import { Cart } from '../components/Cart.jsx';
import { CheckoutForm } from '../components/CheckoutForm.jsx';
import { MenuSection } from '../components/MenuSection.jsx';
import { OrderStatusDrawer } from '../components/OrderStatusDrawer.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';
import { SiteHeader } from '../components/SiteHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSnackbar } from '../context/SnackbarContext.jsx';
import { useCart } from '../hooks/useCart.js';
import { useCurrentOrder } from '../hooks/useCurrentOrder.js';
import { useMenu } from '../hooks/useMenu.js';

export function CustomerPage() {
  const { user, logout } = useAuth();
  const menu = useMenu();
  const cart = useCart();
  const currentOrder = useCurrentOrder();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const { showSnackbar } = useSnackbar();

  const closeCheckout = () => {
    setCheckoutOpen(false);
    setCheckoutError('');
  };

  const placeOrder = async (customer) => {
    setSubmitting(true);
    setCheckoutError('');
    try {
      const createdOrder = await api.createOrder({
        customer,
        items: cart.items.map(({ _id, quantity }) => ({ menuItemId: _id, quantity })),
      });
      currentOrder.setOrder(createdOrder);
      cart.clear();
      setCheckoutOpen(false);
      showSnackbar('Order placed successfully. Track it at the bottom of the screen.', { variant: 'success', duration: 6000 });
    } catch (requestError) {
      setCheckoutError(requestError.message);
      showSnackbar(requestError.message, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SiteHeader user={user} onLogout={logout} />
      <main className={currentOrder.order ? 'customer-main has-order-drawer' : 'customer-main'}>
        <div className="layout">
          <MenuSection {...menu} onAdd={cart.add} onRetry={menu.reload} />
          <Cart
            items={cart.items}
            total={cart.total}
            onChange={cart.change}
            onCheckout={() => setCheckoutOpen(true)}
          />
        </div>
      </main>

      {checkoutOpen && (
        <CheckoutForm
          onSubmit={placeOrder}
          onCancel={closeCheckout}
          submitting={submitting}
          serverError={checkoutError}
        />
      )}
      {currentOrder.order && <OrderStatusDrawer order={currentOrder.order} onDismiss={currentOrder.dismiss} />}
      <SiteFooter />
    </>
  );
}
