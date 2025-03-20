import { ReactNode } from 'react';

/**
 * Interface pour le composant Title
 */
export interface TitleProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  animated?: boolean;
  delay?: number;
}

/**
 * Interface pour le composant Subtitle
 */
export interface SubtitleProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
  animated?: boolean;
  delay?: number;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none';
}
