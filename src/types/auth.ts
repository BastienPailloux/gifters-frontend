import { ReactNode } from 'react';

/**
 * Types liés à l'authentification et aux utilisateurs
 */

export interface User {
  id: string;
  name: string;
  email: string;
  // Ajoutez d'autres propriétés au besoin
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Données pour la connexion
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Données pour l'inscription
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Interface pour les réponses d'erreur de l'API d'authentification
 */
export interface ApiErrorResponse {
  status?: {
    message: string;
  };
  errors?: string[];
}

/**
 * Interface pour le contexte d'authentification
 */
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
}

/**
 * Interface pour les props du provider d'authentification
 */
export interface AuthProviderProps {
  children: ReactNode;
}
