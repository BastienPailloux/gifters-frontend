import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';
import { useTranslation } from 'react-i18next';
import axios, { AxiosError } from 'axios';
import { AuthState, LoginCredentials, RegisterData, ApiErrorResponse, ResetPasswordData } from '../types/auth';

// Hook personnalisé pour l'authentification
const useAuth = () => {
  const { t } = useTranslation('auth');
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = () => {
      try {
        const user = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();

        setAuthState({
          user,
          isAuthenticated,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error loading user:', err);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: t('auth:errors.loadUser'),
        });
      }
    };

    loadUser();
  }, [t]);

  // Fonction de connexion
  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.login(credentials);
      setAuthState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      let errorMessage = t('auth:errors.login');

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.status?.message) {
          errorMessage = error.response.data.status.message;
        } else if (error.response?.data?.errors && error.response.data.errors.length > 0) {
          errorMessage = error.response.data.errors.join(', ');
        }
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [t]);

  // Fonction d'inscription
  const register = useCallback(async (userData: RegisterData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.register(userData);
      setAuthState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      let errorMessage = t('auth:errors.register');

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.status?.message) {
          errorMessage = error.response.data.status.message;
        } else if (error.response?.data?.errors && error.response.data.errors.length > 0) {
          errorMessage = error.response.data.errors.join(', ');
        }
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [t]);

  // Fonction de déconnexion
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error during logout:', err);
      // Même en cas d'erreur, on déconnecte l'utilisateur localement
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  // Fonction pour demander la réinitialisation du mot de passe
  const requestPasswordReset = useCallback(async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.requestPasswordReset(email);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
      return { success: true, message: response.message };
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      let errorMessage = t('auth:errors.passwordReset');

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.status?.message) {
          errorMessage = error.response.data.status.message;
        } else if (error.response?.data?.errors && error.response.data.errors.length > 0) {
          errorMessage = error.response.data.errors.join(', ');
        }
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [t]);

  // Fonction pour réinitialiser le mot de passe
  const resetPassword = useCallback(async (params: ResetPasswordData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.resetPassword(params);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
      return { success: true, message: response.message };
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      let errorMessage = t('auth:errors.passwordReset');

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.status?.message) {
          errorMessage = error.response.data.status.message;
        } else if (error.response?.data?.errors && error.response.data.errors.length > 0) {
          errorMessage = error.response.data.errors.join(', ');
        }
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [t]);

  // Fonction pour effacer les erreurs
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
    requestPasswordReset,
    resetPassword,
  };
};

export default useAuth;
