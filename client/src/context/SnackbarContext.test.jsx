import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SnackbarProvider, useSnackbar } from './SnackbarContext.jsx';

function SnackbarDemo() {
  const { showSnackbar } = useSnackbar();
  return <button onClick={() => showSnackbar('Order updated', { variant: 'success' })}>Notify</button>;
}

describe('SnackbarProvider', () => {
  it('shows and dismisses an accessible notification', async () => {
    render(<SnackbarProvider><SnackbarDemo /></SnackbarProvider>);
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByRole('status')).toHaveTextContent('Order updated');
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Order updated')).not.toBeInTheDocument();
  });
});
