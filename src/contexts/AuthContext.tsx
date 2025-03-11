import React, { createContext, useContext, ReactNode } from 'react';
import useAuthHook from '../hooks/useAuth';

// Interface pour l'utilisateur
interface User {
  id: string;
  name: string;
  email: string;
}

// Interface pour les données d'inscription
interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Définir l'interface pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
}

// Créer le contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props pour le fournisseur de contexte
interface AuthProviderProps {
  children: ReactNode;
}

// Fournisseur de contexte d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthHook();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

export default AuthContext;
