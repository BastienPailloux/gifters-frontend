import { ReactNode } from 'react';

/**
 * Statut d'une idée cadeau
 */
export type GiftStatus = 'proposed' | 'buying' | 'bought';

/**
 * Variantes de couleurs utilisées dans l'application
 */
export type ColorVariant = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'pink';

/**
 * Variantes de boutons disponibles
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * Tailles de boutons disponibles
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Interface pour les props du composant Button
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

/**
 * Interface pour les props du composant Card
 */
export interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: 'elevated' | 'outlined' | 'filled';
}

/**
 * Interface pour les props du composant Modal
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: ReactNode;
  footer?: ReactNode;
  hideCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
}

/**
 * Interface pour les props du composant StatusTag
 */
export interface StatusTagProps {
  status: GiftStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Interface pour les props du composant Input
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  containerClassName?: string;
}

/**
 * Interface pour les options d'un toggle select
 */
export interface ToggleOption<T extends string | number> {
  value: T;
  label: string;
}

/**
 * Interface commune pour les composants de page
 */
export interface PageProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Interface pour les props du composant LabelValue
 */
export interface LabelValueProps {
  label?: string;
  value: ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  orientation?: 'vertical' | 'horizontal';
  isImportant?: boolean;
}

/**
 * Interface pour les props du composant Image
 */
export interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: 'auto' | 'square' | '16/9' | '4/3' | '1/1';
  rounded?: boolean;
  bordered?: boolean;
  onClick?: () => void;
  hasShadow?: boolean;
}

/**
 * Interface pour les props du composant PageHeader
 */
export interface PageHeaderProps {
  title: string;
  description?: string;
  onBackClick?: () => void;
  actions?: ReactNode;
  className?: string;
  showBackButton?: boolean;
}

/**
 * Interface pour les props du composant Avatar
 */
export interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  textClassName?: string;
  fallback?: string;
  onClick?: () => void;
}
