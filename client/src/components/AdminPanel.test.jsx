import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AdminPanel } from './AdminPanel.jsx';
import { api } from '../api.js';
import { SnackbarProvider } from '../context/SnackbarContext.jsx';

vi.mock('../api.js', () => ({ api: { adminMenu: vi.fn(), createMenuItem: vi.fn(), updateMenuItem: vi.fn(), deleteMenuItem: vi.fn() } }));

const menuItem = { _id: '1', name: 'Pizza', description: 'Fresh hot pizza', price: 250, image: 'https://example.com/pizza.jpg', category: 'Pizza', available: true };
const renderAdmin = () => render(<MemoryRouter><SnackbarProvider><AdminPanel /></SnackbarProvider></MemoryRouter>);

describe('AdminPanel', () => {
  beforeEach(() => { vi.clearAllMocks(); api.adminMenu.mockResolvedValue([menuItem]); });

  it('loads items and creates a menu item', async () => {
    api.createMenuItem.mockResolvedValue(menuItem);
    renderAdmin();
    expect(await screen.findByRole('heading', { name: 'Pizza' })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Item name'), 'Burger');
    await userEvent.type(screen.getByLabelText('Category'), 'Burgers');
    await userEvent.type(screen.getByLabelText('Price (₹)'), '199');
    await userEvent.type(screen.getByLabelText('Image URL'), 'https://example.com/burger.jpg');
    await userEvent.type(screen.getByLabelText('Description'), 'Fresh veggie burger');
    await userEvent.click(screen.getByRole('button', { name: 'Add item' }));
    await waitFor(() => expect(api.createMenuItem).toHaveBeenCalledWith(expect.objectContaining({ name: 'Burger', price: 199, available: true })));
    expect(screen.getByText('Menu item added')).toBeInTheDocument();
  });

  it('can hide an existing item', async () => {
    api.updateMenuItem.mockResolvedValue({ ...menuItem, available: false });
    renderAdmin();
    await userEvent.click(await screen.findByRole('button', { name: 'Hide' }));
    await waitFor(() => expect(api.updateMenuItem).toHaveBeenCalledWith('1', { available: false }));
    expect(screen.getByText('Pizza is now hidden')).toBeInTheDocument();
  });
});
