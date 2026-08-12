import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSnackbar } from '../../context/SnackbarContext.jsx';

export function RestaurantAccessForm({ onSubmit }) {
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const submit = async (event) => {
    event.preventDefault();
    if (!accessKey.trim()) return setError('Enter the restaurant access key');
    setSubmitting(true);
    setError('');
    try { await onSubmit(accessKey); }
    catch (requestError) { setError(requestError.message); showSnackbar(requestError.message, { variant: 'error' }); }
    finally { setSubmitting(false); }
  };

  return (
    <main className="restaurant-access-page">
      <section className="restaurant-access-card">
        <Link to="/" className="brand"><span className="brand-mark">Q</span>QuickBite</Link>
        <div className="kitchen-icon">♨</div>
        <span className="eyebrow">Private workspace</span>
        <h1>Restaurant access</h1>
        <p>Enter the kitchen access key to receive orders and manage delivery statuses.</p>
        <form onSubmit={submit}>
          <label>Access key<input type="password" autoComplete="current-password" value={accessKey} onChange={(event) => setAccessKey(event.target.value)} /></label>
          {error && <p role="alert" className="error-panel">{error}</p>}
          <button className="primary wide" disabled={submitting}>{submitting ? 'Opening kitchen…' : 'Open restaurant dashboard'}</button>
        </form>
        <Link className="back-link" to="/">← Back to customer app</Link>
      </section>
    </main>
  );
}
