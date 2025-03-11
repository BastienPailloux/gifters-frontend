import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';

export interface FlatButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  asLink?: boolean;
  href?: string;
  underline?: 'none' | 'hover' | 'always';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const FlatButton: React.FC<FlatButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className,
  asLink = false,
  href = '',
  underline = 'hover',
  icon,
  iconPosition = 'left',
}) => {
  // Base class
  const baseClass = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  // Size classes
  const sizeClasses = {
    small: 'text-xs gap-1',
    medium: 'text-sm gap-2',
    large: 'text-base gap-2',
  };

  // Variant classes
  const variantClasses = {
    primary: 'text-indigo-600 hover:text-indigo-800',
    secondary: 'text-gray-600 hover:text-gray-800',
    danger: 'text-red-600 hover:text-red-800',
  };

  // Underline classes
  const underlineClasses = {
    none: '',
    hover: 'hover:underline',
    always: 'underline',
  };

  // Combine all classes
  const buttonClasses = twMerge(
    baseClass,
    sizeClasses[size],
    variantClasses[variant],
    underlineClasses[underline],
    className
  );

  // Content with icon positioning
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-flex">{icon}</span>}
    </>
  );

  // Render as link or button
  if (asLink && href) {
    return (
      <Link to={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {content}
    </button>
  );
};

export default FlatButton;
