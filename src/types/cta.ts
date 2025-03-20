import { ButtonProps } from './ui';

/**
 * Interface pour le composant CallToAction
 */
export interface CallToActionProps {
  message?: string;
  buttonText: string;
  buttonProps?: Omit<ButtonProps, 'children'>;
  className?: string;
  delay?: number;
  animated?: boolean;
}
