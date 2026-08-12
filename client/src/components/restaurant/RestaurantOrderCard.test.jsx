import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RestaurantOrderCard } from './RestaurantOrderCard.jsx';

const order = {
  _id: '123456789',
  createdAt: '2026-08-12T10:00:00.000Z',
  customer: { name: 'Ada', address: '12 Computing Lane', phone: '9876543210' },
  items: [{ menuItem: '1', name: 'Pizza', quantity: 2, price: 250 }],
  total: 500,
  status: 'Order Received',
};

describe('RestaurantOrderCard', () => {
  it('shows customer/order details and advances to Preparing', async () => {
    const onUpdateStatus = vi.fn();
    render(<RestaurantOrderCard order={order} updating={false} onUpdateStatus={onUpdateStatus}/>);
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('2×')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Start preparing' }));
    expect(onUpdateStatus).toHaveBeenCalledWith('123456789', 'Preparing');
  });
});
