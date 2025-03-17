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
