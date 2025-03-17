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
