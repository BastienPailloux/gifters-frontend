import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  fullWidth = false,
  className,
  children,
  ...rest
}) => {
  // Base classes
  const baseClasses = 'rounded-lg overflow-hidden';

  // Variant classes
  const variantClasses = {
    default: 'bg-white shadow-sm',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-soft',
  };

  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Combine all classes
  const cardClasses = twMerge(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    widthClasses,
    className
  );

  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  );
};

export default Card;
