import React, { createContext, useContext } from 'react';
import useAuthHook from '../hooks/useAuth';
import { AuthContextType, AuthProviderProps } from '../types/auth';

// Créer le contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
