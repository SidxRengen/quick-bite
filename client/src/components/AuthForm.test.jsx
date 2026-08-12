import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthForm } from './AuthForm.jsx';
import { SnackbarProvider } from '../context/SnackbarContext.jsx';
const renderAuth = (onAuthenticate) => render(<MemoryRouter><SnackbarProvider><AuthForm onAuthenticate={onAuthenticate}/></SnackbarProvider></MemoryRouter>);

describe('AuthForm', () => {
  it('validates login and submits valid credentials', async () => {
    const onAuthenticate = vi.fn().mockResolvedValue();
    renderAuth(onAuthenticate);
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i);
    await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'securepass123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(onAuthenticate).toHaveBeenCalledWith('login', { name: '', email: 'ada@example.com', password: 'securepass123' });
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('switches to registration and requires a name', async () => {
    renderAuth(vi.fn());
    await userEvent.click(screen.getByRole('button', { name: /create an account/i }));
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/full name/i);
  });
});
