import { ReactNode } from 'react';

/**
 * Propriétés pour une icône de réseau social
 */
export interface SocialIconProps {
  name: string;
  href: string;
  icon: ReactNode;
  label?: string;
  className?: string;
}

/**
 * Type pour un réseau social
 */
export interface SocialNetwork {
  name: string;
  url: string;
  icon: ReactNode;
  label?: string;
  ariaLabel?: string;
}

/**
 * Propriétés pour le composant de liens sociaux
 */
export interface SocialLinksProps {
  networks: SocialNetwork[];
  className?: string;
  iconClassName?: string;
}
