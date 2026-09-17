import { Navigate } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { useAuth } from '../context/AuthContext';

export function HomeRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />;
}

export default HomeRoute;