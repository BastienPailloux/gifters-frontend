import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { CheckboxProps } from '../../../types';

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      labelClassName,
      containerClassName,
      checkboxClassName,
      id,
      ...rest
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    // Base classes
    const baseCheckboxClasses = 'h-4 w-4 focus:ring-primary-500 border-gray-300 rounded';

    // Error classes
    const errorClasses = error
      ? 'text-red-600 border-red-300 focus:ring-red-500'
      : 'text-primary-600';

    // Combine all classes
    const inputClasses = twMerge(
      baseCheckboxClasses,
      errorClasses,
      checkboxClassName
    );

    // Label classes
    const baseLabelClasses = 'ml-2 block text-sm text-gray-900';
    const labelClasses = twMerge(baseLabelClasses, labelClassName);

    return (
      <div className={twMerge('flex items-center mb-4', containerClassName)}>
        <div className="flex items-center">
          <input
            id={checkboxId}
            type="checkbox"
            ref={ref}
            className={twMerge(inputClasses, className)}
            aria-invalid={!!error}
            aria-describedby={error ? `${checkboxId}-error` : helperText ? `${checkboxId}-helper` : undefined}
            {...rest}
          />
          {label && (
            <label htmlFor={checkboxId} className={labelClasses}>
              {label}
            </label>
          )}
        </div>
        {error && (
          <p id={`${checkboxId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${checkboxId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
