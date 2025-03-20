/**
 * Types pour les composants de contact
 */

import { ReactNode } from 'react';
import { FaqItem } from './faq';

/**
 * Props pour le composant ContactFaq
 */
export interface ContactFaqProps {
  faqs?: FaqItem[];
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Données du formulaire de contact
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Props pour le composant ContactForm
 */
export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  title?: string;
  description?: string;
  submitButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
}

/**
 * Structure pour une entrée d'information de contact
 */
export interface ContactInfoItem {
  id: string | number;
  icon?: ReactNode;
  title: string;
  content: string | ReactNode;
  link?: string;
}

/**
 * Props pour le composant ContactInfo
 */
export interface ContactInfoProps {
  items: ContactInfoItem[];
  title?: string;
  description?: string;
  className?: string;
}
