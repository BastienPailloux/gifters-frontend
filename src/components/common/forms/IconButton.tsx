import React, { ReactNode } from 'react';

interface IconButtonProps {
  /** Icône SVG à afficher */
  icon: ReactNode;
  /** Fonction appelée au clic */
  onClick?: () => void;
  /** Titre pour l'accessibilité */
  title?: string;
  /** Label pour l'accessibilité */
  ariaLabel: string;
  /** Style de variant */
  variant?: 'primary' | 'secondary';
  /** Bouton désactivé */
  disabled?: boolean;
  /** Classes CSS supplémentaires */
  className?: string;
  /** Type de bouton */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Bouton carré avec une icône au centre
 * Utilisé pour des actions compactes dans les listes ou sidebars
 */
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  title,
  ariaLabel,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const baseClasses = 'flex items-center justify-center w-9 h-9 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed',
    secondary: 'bg-primary-100 text-primary-700 hover:bg-primary-200 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      title={title || ariaLabel}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {icon}
    </button>
  );
};

export default IconButton;
