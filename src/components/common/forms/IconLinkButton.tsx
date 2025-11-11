import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface IconLinkButtonProps {
  /** Icône SVG à afficher */
  icon: ReactNode;
  /** URL de destination */
  to: string;
  /** Titre pour l'accessibilité */
  title?: string;
  /** Label pour l'accessibilité */
  ariaLabel: string;
  /** Style de variant */
  variant?: 'primary' | 'secondary';
  /** Classes CSS supplémentaires */
  className?: string;
}

/**
 * Bouton carré avec une icône qui fonctionne comme un lien
 * Version Link du composant IconButton
 */
const IconLinkButton: React.FC<IconLinkButtonProps> = ({
  icon,
  to,
  title,
  ariaLabel,
  variant = 'primary',
  className = '',
}) => {
  const baseClasses = 'flex items-center justify-center w-9 h-9 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-primary-100 text-primary-700 hover:bg-primary-200 focus:ring-primary-500',
  };

  return (
    <Link
      to={to}
      title={title || ariaLabel}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {icon}
    </Link>
  );
};

export default IconLinkButton;
