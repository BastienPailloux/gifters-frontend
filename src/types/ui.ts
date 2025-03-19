import { ReactNode } from 'react';

/**
 * Statut d'une idée cadeau
 */
export type GiftStatus = 'proposed' | 'buying' | 'bought' | 'wishlist';

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
 * Interface pour les props du composant Checkbox
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  error?: string;
  helperText?: string;
  labelClassName?: string;
  containerClassName?: string;
  checkboxClassName?: string;
}

/**
 * Interface pour les options d'un toggle select
 */
export interface ToggleOption<T extends string | number> {
  value: T;
  label: string;
}

/**
 * Interface pour les props du composant ToggleSelect
 */
export interface ToggleSelectProps<T extends string | number> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  optionClassName?: string;
  selectedClassName?: string;
  unselectedClassName?: string;
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
  status?: GiftStatus;
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

/**
 * Interface pour les props du composant ClickableCard
 */
export interface ClickableCardProps extends CardProps {
  activeClassName?: string;
  isActive?: boolean;
}

/**
 * Interface pour les props du composant FlatButton
 */
export interface FlatButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  asLink?: boolean;
  href?: string;
  underline?: 'none' | 'hover' | 'always';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Props pour le composant de témoignage
 */
export interface TestimonialProps {
  content: string;
  author: {
    name: string;
    title?: string;
    company?: string;
    avatarUrl?: string;
  };
  rating?: number;
  className?: string;
}

/**
 * Props pour le composant de slider de témoignages
 */
export interface TestimonialSliderProps {
  testimonials: TestimonialProps[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  maxDesktopItems?: number;
}

/**
 * Props pour le composant de bouton retour
 */
export interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

/**
 * Props pour le composant de sélection de langue
 */
export interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'minimal';
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  languages?: { code: string; name: string; flag?: string }[];
}

/**
 * Props pour le composant d'étiquette colorée
 */
export interface ColorTagProps {
  text: string;
  color?: ColorVariant;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Props pour le composant de lecteur vidéo
 */
export interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  overlayClassName?: string;
  fallbackImage?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9';
}

/**
 * Props pour le composant de modal de confirmation
 */
export interface ConfirmationModalProps {
  /**
   * Détermine si la modal est visible
   */
  isOpen: boolean;

  /**
   * Fonction appelée lors de la fermeture de la modal
   */
  onClose: () => void;

  /**
   * Titre de la modal de confirmation
   */
  title?: string;

  /**
   * Message de confirmation à afficher
   */
  message?: string;

  /**
   * Fonction appelée lorsque l'utilisateur confirme l'action
   */
  onConfirm: () => void;

  /**
   * Texte du bouton de confirmation
   */
  confirmText?: string;

  /**
   * Texte du bouton d'annulation
   */
  cancelText?: string;

  /**
   * Si l'action est en cours (pour afficher un état de chargement)
   */
  isLoading?: boolean;

  /**
   * Variante du bouton de confirmation
   */
  confirmVariant?: 'primary' | 'danger' | 'secondary';

  /**
   * Taille de la modal
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Props pour le composant de page "en construction"
 */
export interface UnderConstructionPageProps extends PageProps {
  onBackClick?: () => void;
}
