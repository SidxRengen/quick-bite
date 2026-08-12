import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { CustomerPage } from './pages/CustomerPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { RestaurantPage } from './pages/RestaurantPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<CustomerPage />} />
      </Route>
      <Route path="/admin" element={<Navigate to="/restaurant" replace />} />
      <Route path="/restaurant" element={<RestaurantPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
