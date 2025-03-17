import React from 'react';
import { twMerge } from 'tailwind-merge';
import { AvatarProps } from '../../../types';

/**
 * Composant Avatar qui affiche la première lettre du nom fourni dans un cercle
 * avec des styles personnalisables
 */
const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  variant = 'primary',
  className = '',
  textClassName = '',
  fallback = '?',
  onClick,
}) => {
  // Extraire l'initiale à partir du nom
  const initial = name && name.length > 0
    ? name.charAt(0).toUpperCase()
    : fallback;

  // Classes de taille pour l'avatar
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-2xl',
  };

  // Classes de variante pour l'avatar
  const variantClasses = {
    primary: 'bg-indigo-100 text-indigo-600',
    secondary: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };

  // Classes pour l'élément cliquable
  const clickableClasses = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  // Combiner toutes les classes
  const avatarClasses = twMerge(
    'flex items-center justify-center rounded-full font-semibold select-none',
    sizeClasses[size],
    variantClasses[variant],
    clickableClasses,
    className
  );

  return (
    <div className={avatarClasses} onClick={onClick}>
      <span className={twMerge('select-none', textClassName)}>{initial}</span>
    </div>
  );
};

export default Avatar;
