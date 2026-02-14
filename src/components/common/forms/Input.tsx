import { forwardRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { InputProps } from '../../../types';
import PasswordToggleButton from './PasswordToggleButton';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      startIcon,
      endIcon,
      className,
      containerClassName,
      id,
      type,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    // Generate a unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    // Base classes
    const baseInputClasses = 'appearance-none block px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm';

    // Error classes
    const errorClasses = error
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 text-gray-900';

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';

    // Icon padding (right side: password toggle or endIcon)
    const hasRightContent = isPassword || endIcon;
    const iconPaddingClasses = startIcon ? 'pl-10' : hasRightContent ? 'pr-10' : '';

    // Combine all classes
    const inputClasses = twMerge(
      baseInputClasses,
      errorClasses,
      widthClasses,
      iconPaddingClasses,
      className
    );

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={twMerge('mb-4', containerClassName)} data-testid="input-container">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {startIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...rest}
          />
          {isPassword && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <PasswordToggleButton
                visible={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
              />
            </div>
          )}
          {!isPassword && endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
