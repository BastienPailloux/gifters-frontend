import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { RouteConfig } from './routeConfig';

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

// Composant pour gérer le fallback de Suspense
const FallbackLoading = () => (
  <div className="flex justify-center items-center h-screen">
    Chargement de la page...
  </div>
);

// Composant qui génère les routes à partir de la configuration
const RouteRenderer: React.FC<{ routes: RouteConfig[] }> = ({ routes }) => {
  const renderRouteElement = (route: RouteConfig) => {
    const Component = route.component;

    // Composant de base
    let element = (
      <Suspense fallback={<FallbackLoading />}>
        <Component />
      </Suspense>
    );

    // Ajouter le layout si nécessaire
    if (route.layout) {
      element = <Layout>{element}</Layout>;
    }

    // Ajouter la protection si nécessaire
    if (route.protected) {
      element = <ProtectedRoute>{element}</ProtectedRoute>;
    }

    return element;
  };

  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={renderRouteElement(route)}
        />
      ))}
      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default RouteRenderer;
