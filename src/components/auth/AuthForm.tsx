import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthFormProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkUrl?: string;
  error?: string | null;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  footer?: ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  linkText,
  linkUrl,
  error,
  onSubmit,
  children,
  footer,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Gifters</h2>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        {subtitle && linkText && linkUrl && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {subtitle}{' '}
            <Link to={linkUrl} className="font-medium text-primary-600 hover:text-primary-500">
              {linkText}
            </Link>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={onSubmit}>
            {children}
          </form>

          {footer && (
            <div className="mt-6">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
