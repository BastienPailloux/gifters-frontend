import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BackButtonProps } from '../../../types';

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  className = '',
  label
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center text-sm text-gray-500 hover:text-gray-700 ${className}`}
      aria-label="Back"
    >
      <svg className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label || t('common.back') || 'Back'}
    </button>
  );
};

export default BackButton;
