import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { OrderStatusDrawer } from './OrderStatusDrawer.jsx';

const order = {
  _id: '123456789',
  customer: { name: 'Ada', address: '12 Computing Lane' },
  items: [{ menuItem: '1', name: 'Pizza', quantity: 1, price: 250 }],
  total: 250,
  status: 'Order Received',
};

describe('OrderStatusDrawer', () => {
  it('starts collapsed at the bottom and expands to show the timeline', async () => {
    render(<OrderStatusDrawer order={order} onDismiss={() => {}}/>);
    const toggle = screen.getByRole('button', { name: /order received/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/restaurant has received/i)).toBeInTheDocument();
  });
});
