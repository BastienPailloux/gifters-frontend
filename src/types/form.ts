/**
 * Types pour les composants de formulaire
 */

import { ChangeEvent, HTMLAttributes } from 'react';

/**
 * Base de props pour les inputs
 */
export interface InputBaseProps extends HTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  name: string;
  label?: string;
  error?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helpText?: string;
  helperText?: string;
}

/**
 * Props pour le composant TextArea
 */
export interface TextAreaProps extends Omit<InputBaseProps, 'type'> {
  rows?: number;
  minLength?: number;
  maxLength?: number;
  resizable?: boolean;
  autoResize?: boolean;
  showCharCount?: boolean;
  id?: string;
}

/**
 * Props pour le composant TextField
 */
export interface TextFieldProps extends InputBaseProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  min?: number | string;
  max?: number | string;
  step?: number | string;
  autoComplete?: string;
}
