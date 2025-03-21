import { ReactNode } from 'react';
import { ComponentType, LazyExoticComponent } from 'react';

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

/**
 * Configuration pour une route
 */
export interface RouteConfig {
  path: string;
  component: ComponentType<Record<string, unknown>> | LazyExoticComponent<ComponentType<Record<string, unknown>>>;
  layout?: boolean;
  protected?: boolean;
  children?: RouteConfig[];
}

/**
 * Catégories pour les idées de cadeaux
 */
export type CategoryType = 'wishlist' | 'suggestions' | 'buying' | 'bought';
