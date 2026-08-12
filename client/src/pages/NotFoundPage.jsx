import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="not-found">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link className="primary link-button" to="/">Return home</Link>
    </main>
  );
}
