import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Tasks from '@/pages/Tasks';
import Withdraw from '@/pages/Withdraw';
import Admin from '@/pages/Admin';
import './App.css';

// Simple router using hash-based navigation
function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Redirect logic
  if (isAdmin && currentPath !== '/admin') {
    window.location.hash = '/admin';
    return null;
  }

  if (isAuthenticated && !isAdmin) {
    const protectedRoutes = ['/dashboard', '/tasks', '/withdraw'];
    if (!protectedRoutes.includes(currentPath) && currentPath !== '/') {
      window.location.hash = '/dashboard';
      return null;
    }
  }

  if (!isAuthenticated) {
    const publicRoutes = ['/', '/login', '/register'];
    if (!publicRoutes.includes(currentPath)) {
      window.location.hash = '/login';
      return null;
    }
  }

  // Route rendering
  switch (currentPath) {
    case '/':
      return <LandingPage />;
    case '/login':
      return isAuthenticated ? <Redirect to="/dashboard" /> : <Login />;
    case '/register':
      return isAuthenticated ? <Redirect to="/dashboard" /> : <Register />;
    case '/dashboard':
      return isAuthenticated && !isAdmin ? <Dashboard /> : <Redirect to="/login" />;
    case '/tasks':
      return isAuthenticated && !isAdmin ? <Tasks /> : <Redirect to="/login" />;
    case '/withdraw':
      return isAuthenticated && !isAdmin ? <Withdraw /> : <Redirect to="/login" />;
    case '/admin':
      return isAdmin ? <Admin /> : <Redirect to="/login" />;
    default:
      return <LandingPage />;
  }
}

function Redirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.hash = to;
  }, [to]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
