import React from 'react';
import { Link } from 'react-router-dom';
import { AuthFormProps } from '../../types';

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  linkText,
  linkUrl,
  error,
  success,
  successMessage,
  onSubmit,
  children,
  footer,
}) => {
  // Utiliser success ou successMessage selon celui qui est fourni
  const successText = success || successMessage;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-center text-sm text-gray-500">
            {subtitle}
            {linkText && linkUrl && (
              <>
                {" "}
                <Link to={linkUrl} className="font-semibold text-primary-600 hover:text-primary-500">
                  {linkText}
                </Link>
              </>
            )}
          </p>
        )}
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {successText && (
          <div className="mb-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{successText}</h3>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={onSubmit}>
          {children}
        </form>

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default AuthForm;
