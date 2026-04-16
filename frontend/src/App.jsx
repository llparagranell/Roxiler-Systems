import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Topbar from './components/Topbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import PasswordPage from './pages/PasswordPage.jsx';
import { auth } from './api.js';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      auth.me().then((data) => {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }).catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }

    if (!token && user) {
      setUser(null);
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    navigate(`/${data.user.role}`);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const authContext = useMemo(() => ({ user, token, handleLogin }), [user, token]);

  return (
    <div className="min-h-screen bg-brand-soft text-brand-text antialiased">
      <Topbar user={user} onLogout={handleLogout} />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <Routes>
          <Route path="/" element={user ? <Navigate to={`/${user.role}`} replace /> : <LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} token={token} role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute user={user} token={token} role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <ProtectedRoute user={user} token={token} role="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/password"
            element={
              <ProtectedRoute user={user} token={token}>
                <PasswordPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
