import React from 'react';
import { ColorTagProps } from '../../../types';

/**
 * Composant réutilisable pour afficher un tag coloré
 * Ce composant est indépendant de la notion de statut
 */
const ColorTag: React.FC<ColorTagProps> = ({
  text,
  color = 'gray',
  className = '',
  size = 'medium'
}) => {
  /**
   * Retourne les classes CSS en fonction de la couleur
   */
  const getColorClasses = (): string => {
    const baseClasses = 'font-medium rounded-full';
    switch (color) {
      case 'blue':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'green':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'yellow':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'red':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'purple':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'pink':
        return `${baseClasses} bg-pink-100 text-pink-800`;
      case 'gray':
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Déterminer les classes de taille
  const sizeClasses = {
    small: 'text-xs px-1.5 py-0.5',
    medium: 'text-xs px-2 py-0.5',
    large: 'text-sm px-2.5 py-1'
  };

  return (
    <span
      className={`${getColorClasses()} ${sizeClasses[size]} ${className}`}
    >
      {text}
    </span>
  );
};

export default ColorTag;
