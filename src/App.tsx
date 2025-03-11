import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';

// Composant pour les routes protégées
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Afficher un indicateur de chargement pendant la vérification de l'authentification
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Composant pour les routes qui utilisent le Layout commun
interface LayoutRouteProps {
  children: React.ReactNode;
}

const LayoutRoute: React.FC<LayoutRouteProps> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Routes publiques sans Layout */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Routes protégées avec Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <LayoutRoute>
              <Dashboard />
            </LayoutRoute>
          </ProtectedRoute>
        }
      />

      {/* Autres routes protégées à ajouter ici */}

      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
