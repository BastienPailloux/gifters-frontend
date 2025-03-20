import { ButtonProps } from './ui';

/**
 * Interface pour les icônes de fonctionnalités
 */
export interface FeatureIconProps {
  icon: 'users' | 'gift' | 'calendar' | 'bell' | 'shield' | 'globe';
  className?: string;
}

/**
 * Interface pour les cartes de fonctionnalités
 */
export interface FeatureCardProps {
  title: string;
  description: string;
  icon: 'users' | 'gift' | 'calendar' | 'bell' | 'shield' | 'globe';
  buttonText?: string;
  buttonProps?: Omit<ButtonProps, 'children'>;
  delay?: number;
  className?: string;
}

/**
 * Interface pour la grille de fonctionnalités
 */
export interface FeaturesGridProps {
  features: Omit<FeatureCardProps, 'delay'>[];
  className?: string;
}

/**
 * Interface pour les fonctionnalités détaillées
 */
export interface DetailedFeatureProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  className?: string;
  animated?: boolean;
}

/**
 * Interface pour la section de fonctionnalités détaillées
 */
export interface DetailedFeaturesSectionProps {
  sectionTitle?: string;
  features: (Omit<DetailedFeatureProps, 'animated'> & { id: string })[];
  className?: string;
  animated?: boolean;
}
