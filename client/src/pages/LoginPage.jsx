import { Navigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function LoginPage() {
  const { user, checkingSession, authenticate } = useAuth();

  if (checkingSession) return <main><p role="status">Checking your session…</p></main>;
  if (user) return <Navigate to="/" replace />;

  return <AuthForm onAuthenticate={authenticate} />;
}
