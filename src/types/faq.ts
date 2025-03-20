/**
 * Types pour les composants de FAQ
 */

import { ReactNode } from 'react';

/**
 * Interface pour un élément de FAQ individuel
 */
export interface FaqItem {
  id: string | number;
  question: string;
  answer: string | ReactNode;
  isOpen?: boolean;
  translationKey?: string;
}

/**
 * Props pour le composant Faq
 */
export interface FaqProps {
  items: FaqItem[];
  title?: string;
  description?: string;
  className?: string;
  titleSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  titleTranslationKey?: string;
  translationPrefix?: string;
  itemClassName?: string;
}

/**
 * Props pour le composant HelpFaq
 */
export interface HelpFaqProps {
  faqs?: FaqItem[];
  title?: string;
  description?: string;
  contactLink?: string;
  contactLinkText?: string;
  className?: string;
}

/**
 * Props pour le composant FaqAccordion
 */
export interface FaqAccordionProps {
  faqItem: FaqItem;
  isOpen: boolean;
  toggleAccordion: () => void;
  className?: string;
}
