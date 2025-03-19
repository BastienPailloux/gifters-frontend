import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import GroupDetails from './pages/GroupDetails';
import GiftIdeaDetails from './pages/GiftIdeaDetails';
import InvitationJoin from './pages/invitation/InvitationJoin';
import InvitationInput from './pages/invitation/InvitationInput';
import MyGifts from './pages/MyGifts';
import MyGroups from './pages/MyGroups';
import Events from './pages/Events';
import { ProtectedRouteProps, LayoutRouteProps } from './types';

// Composant pour les routes protégées
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

      {/* Routes pour les invitations */}
      <Route path="/invitation/join" element={<InvitationJoin />} />

      {/* Route protégée pour entrer un code d'invitation */}
      <Route
        path="/invitations"
        element={
          <ProtectedRoute>
            <LayoutRoute>
              <InvitationInput />
            </LayoutRoute>
          </ProtectedRoute>
        }
      />

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

      {/* Route pour la page Mes Cadeaux */}
      <Route
        path="/my-gifts"
        element={
          <ProtectedRoute>
            <LayoutRoute>
              <MyGifts />
            </LayoutRoute>
          </ProtectedRoute>
        }
      />

      {/* Route pour la page Mes Groupes */}
      <Route
        path="/my-groups"
        element={
          <ProtectedRoute>
            <LayoutRoute>
              <MyGroups />
            </LayoutRoute>
          </ProtectedRoute>
        }
      />

      {/* Route pour les détails d'un groupe */}
      <Route
        path="/groups/:id"
        element={
          <ProtectedRoute>
            <LayoutRoute>
              <GroupDetails />
            </LayoutRoute>
          </ProtectedRoute>
        }
      />

      {/* Route pour les détails d'une idée cadeau */}
      <Route
        path="/gift-ideas/:id"
        element={
          <ProtectedRoute>
            <LayoutRoute>
              <GiftIdeaDetails />
            </LayoutRoute>
          </ProtectedRoute>
        }
      />

      {/* Route pour la page des événements */}
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <LayoutRoute>
              <Events />
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
