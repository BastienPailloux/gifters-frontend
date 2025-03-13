import React from 'react';

export type ColorVariant = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'pink';

interface ColorTagProps {
  text: string; // Le texte est maintenant obligatoire
  color?: ColorVariant; // Couleur optionnelle, gris par défaut
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

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
  // Déterminer les classes de taille
  const sizeClasses = {
    small: 'text-xs px-1.5 py-0.5',
    medium: 'text-xs px-2 py-0.5',
    large: 'text-sm px-2.5 py-1'
  };

  // Déterminer la couleur à utiliser
  const getColorClasses = (): string => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'red':
        return 'bg-red-100 text-red-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      case 'pink':
        return 'bg-pink-100 text-pink-800';
      case 'gray':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`rounded-full inline-flex items-center justify-center font-medium ${sizeClasses[size]} ${getColorClasses()} ${className}`}
    >
      {text}
    </span>
  );
};

export default ColorTag;
