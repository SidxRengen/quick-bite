import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MenuCard } from './MenuCard.jsx';
const item = { _id: '1', name: 'Pizza', description: 'Fresh pizza', price: 200, image: '/pizza.jpg', category: 'Main' };
describe('MenuCard', () => { it('shows menu details and adds the item', async () => { const onAdd = vi.fn(); render(<MenuCard item={item} onAdd={onAdd}/>); expect(screen.getByText('Pizza')).toBeInTheDocument(); expect(screen.getByText('Fresh pizza')).toBeInTheDocument(); expect(screen.getByText('₹200.00')).toBeInTheDocument(); await userEvent.click(screen.getByRole('button', { name: /add pizza/i })); expect(onAdd).toHaveBeenCalledWith(item); }); });
