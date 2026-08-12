import { Link } from 'react-router-dom';

export function SiteHeader({ user, onLogout, mode = 'customer' }) {
  const isRestaurant = mode === 'restaurant';
  const homePath = isRestaurant ? '/restaurant' : '/';

  return (
    <header className="site-header">
      <Link to={homePath} className="brand"><span className="brand-mark">Q</span>QuickBite</Link>
      <div className="account">
        {isRestaurant ? (
          <>
            <span className="workspace-label">Restaurant workspace</span>
            {onLogout && <button className="secondary" onClick={onLogout}>Sign out</button>}
          </>
        ) : (
          <>
            <span>Hi, {user.name}</span>
            <button className="secondary" onClick={onLogout}>Sign out</button>
          </>
        )}
      </div>
    </header>
  );
}
