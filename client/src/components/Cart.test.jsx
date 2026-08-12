import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Cart } from './Cart.jsx';
describe('Cart', () => { it('shows empty state', () => { render(<Cart items={[]} total={0} onChange={() => {}} onCheckout={() => {}}/>); expect(screen.getByText(/cart is empty/i)).toBeInTheDocument(); }); it('changes quantities and starts checkout', async () => { const onChange = vi.fn(); const onCheckout = vi.fn(); render(<Cart items={[{ _id: '1', name: 'Pizza', price: 200, quantity: 2 }]} total={400} onChange={onChange} onCheckout={onCheckout}/>); await userEvent.click(screen.getByRole('button', { name: /decrease pizza/i })); expect(onChange).toHaveBeenCalledWith('1', 1); await userEvent.click(screen.getByRole('button', { name: /checkout/i })); expect(onCheckout).toHaveBeenCalled(); }); });
