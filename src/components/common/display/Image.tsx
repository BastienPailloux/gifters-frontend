import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ImageProps } from '../../../types';

/**
 * Composant Image réutilisable
 * Gère l'affichage des images avec des options de style cohérentes
 * et la gestion des erreurs de chargement
 */
const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackSrc = '/placeholder-image.png', // Assurez-vous d'avoir cette image dans le dossier public
  objectFit = 'contain',
  aspectRatio = 'auto',
  rounded = false,
  bordered = false,
  onClick,
  hasShadow = false,
}) => {
  const [error, setError] = useState<boolean>(false);

  // Gestion du clic sur l'image
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Gestion des erreurs de chargement d'image
  const handleError = () => {
    if (!error && fallbackSrc) {
      setError(true);
    }
  };

  // Construction des classes pour le conteneur
  const containerClasses = twMerge(
    'overflow-hidden',
    aspectRatio === 'square' || aspectRatio === '1/1' ? 'aspect-square' : '',
    aspectRatio === '16/9' ? 'aspect-video' : '',
    aspectRatio === '4/3' ? 'aspect-4/3' : '',
    rounded ? 'rounded-lg' : '',
    bordered ? 'border border-gray-200' : '',
    hasShadow ? 'shadow-md' : '',
    onClick ? 'cursor-pointer' : '',
    containerClassName
  );

  // Construction des classes pour l'image
  const imageClasses = twMerge(
    'w-full h-auto',
    `object-${objectFit}`,
    className
  );

  return (
    <div className={containerClasses} onClick={handleClick}>
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        className={imageClasses}
        onError={handleError}
      />
    </div>
  );
};

export default Image;
