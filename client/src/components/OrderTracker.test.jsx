import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OrderTracker } from './OrderTracker.jsx';

const order = {
  _id: '123456789',
  customer: { name: 'Ada', address: '12 Computing Lane' },
  items: [{ menuItem: '1', name: 'Pizza', quantity: 2, price: 250 }],
  total: 500,
  status: 'Preparing',
};

describe('OrderTracker', () => {
  it('renders the current restaurant-controlled order status', () => {
    render(<OrderTracker order={order}/>);
    expect(screen.getByRole('heading', { name: 'Preparing' })).toBeInTheDocument();
    expect(screen.getByText(/freshly prepared/i)).toBeInTheDocument();
    expect(screen.getByText(/updates appear here automatically/i)).toBeInTheDocument();
  });
});
