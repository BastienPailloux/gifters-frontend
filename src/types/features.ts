import { ButtonProps } from './ui';

/**
 * Interface pour les icônes de fonctionnalités
 */
export interface FeatureIconProps {
  name: 'gift' | 'users' | 'calendar' | 'bell' | 'shield' | 'globe' | 'check' | 'star' | 'heart';
  size?: number;
  className?: string;
}

/**
 * Interface pour les cartes de fonctionnalités
 */
export interface FeatureCardProps {
  title: string;
  description: string;
  icon: FeatureIconProps['name'];
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
  animated?: boolean;
}

/**
 * Interface pour les fonctionnalités détaillées
 */
export interface DetailedFeature {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

/**
 * Interface pour la section de fonctionnalités détaillées
 */
export interface DetailedFeatureProps {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reversed?: boolean;
  className?: string;
  animated?: boolean;
}

/**
 * Interface pour la section détaillée de fonctionnalités
 */
export interface DetailedFeaturesSectionProps {
  sectionTitle: string;
  features: DetailedFeature[];
  className?: string;
  animated?: boolean;
}
