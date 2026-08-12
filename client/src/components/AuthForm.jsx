import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext.jsx';

export function AuthForm({ onAuthenticate }) {
  const [mode, setMode] = useState('login');
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (mode === 'register' && values.name.trim().length < 2) return setError('Enter your full name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return setError('Enter a valid email address');
    if (values.password.length < 8) return setError('Password must contain at least 8 characters');
    setSubmitting(true);
    try { await onAuthenticate(mode, values); showSnackbar(mode === 'login' ? 'Welcome back' : 'Account created successfully', { variant: 'success' }); }
    catch (requestError) { setError(requestError.message); showSnackbar(requestError.message, { variant: 'error' }); }
    finally { setSubmitting(false); }
  };

  const switchMode = () => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); };
  return <main className="auth-page"><section className="auth-card">
    <Link to="/" className="brand"><span className="brand-mark">Q</span>QuickBite</Link>
    <span className="eyebrow">Welcome</span>
    <h1>{mode === 'login' ? 'Sign in to order' : 'Create your account'}</h1>
    <p>{mode === 'login' ? 'Your next meal is only a few clicks away.' : 'Register once, then order and track securely.'}</p>
    <form onSubmit={submit} noValidate>
      {mode === 'register' && <label>Full name<input autoComplete="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })}/></label>}
      <label>Email<input type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })}/></label>
      <label>Password<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })}/></label>
      {error && <p role="alert" className="error-panel">{error}</p>}
      <button className="primary wide" disabled={submitting}>{submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
    </form>
    <button className="auth-switch" onClick={switchMode}>{mode === 'login' ? 'New here? Create an account' : 'Already registered? Sign in'}</button>
  </section></main>;
}
