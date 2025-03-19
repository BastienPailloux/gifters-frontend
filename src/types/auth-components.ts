import { ReactNode } from 'react';

/**
 * Props pour le composant AuthForm qui gère les formulaires d'authentification
 */
export interface AuthFormProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkUrl?: string;
  error?: string | null;
  success?: string | null;
  successMessage?: string | null;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Props pour le composant LoginForm qui gère le formulaire de connexion
 */
export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

/**
 * Props pour le composant RegisterForm qui gère le formulaire d'inscription
 */
export interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

/**
 * Props pour le composant ResetPasswordForm qui gère le formulaire de réinitialisation de mot de passe
 */
export interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
  success?: boolean;
}
