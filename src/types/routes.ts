import { ReactNode } from 'react';

/**
 * Props pour le composant ProtectedRoute qui sécurise l'accès aux pages nécessitant une authentification
 */
export interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Props pour le composant LayoutRoute qui enveloppe les pages dans le layout commun
 */
export interface LayoutRouteProps {
  children: ReactNode;
}
