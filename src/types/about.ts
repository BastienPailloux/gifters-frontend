import { ReactNode } from 'react';
import { Variants } from 'framer-motion';

/**
 * Propriétés pour une carte d'information dans la section About
 */
export interface AboutCardProps {
  title: string;
  paragraphs: string[];
  icon?: ReactNode;
  className?: string;
  variants?: Variants;
}

/**
 * Item pour la grille de cartes About
 */
export interface AboutCardItem {
  title: string;
  content: string;
  icon?: ReactNode;
}

/**
 * Propriétés pour la grille de cartes About
 */
export interface AboutCardGridProps {
  items: AboutCardItem[];
  className?: string;
}
