import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CardProps } from '../../../types';

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className,
  titleClassName,
  bodyClassName,
  footerClassName,
  onClick,
  hoverable = false,
  variant,
}) => {
  // Base classes
  const baseClasses = 'bg-white overflow-hidden shadow rounded-lg';

  // Variant classes pour la compatibilité
  const variantClasses = variant ? {
    elevated: 'shadow-md',
    outlined: 'border border-gray-200 shadow-sm',
    filled: 'bg-gray-50'
  }[variant] : '';

  // Hover classes
  const hoverClasses = hoverable ? 'transition-transform hover:scale-105 cursor-pointer' : '';

  // Combine all classes
  const cardClasses = twMerge(baseClasses, variantClasses, hoverClasses, className);

  return (
    <div
      className={cardClasses}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className={twMerge("px-4 py-5 sm:px-6", titleClassName)}>
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className={twMerge("px-4 py-5 sm:p-6", bodyClassName)}>
        {children}
      </div>
      {footer && (
        <div className={twMerge("px-4 py-4 sm:px-6 bg-gray-50", footerClassName)}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
