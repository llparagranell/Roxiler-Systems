import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, token, role, children }) {
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
