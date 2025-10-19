import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../forms/Button';
import { UnderConstructionPageProps } from '../../../types/ui';

const UnderConstructionPage: React.FC<UnderConstructionPageProps> = ({
  title,
  description,
  onBackClick
}) => {
  const { t } = useTranslation(); // Utilise 'common' par défaut
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icône de construction */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </div>

        {/* Titre */}
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          {title || t('common.underConstruction.title', 'En Construction')}
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600">
          {description || t('common.underConstruction.description', 'Cette fonctionnalité est actuellement en développement. Elle sera bientôt disponible !')}
        </p>

        {/* Bouton Retour */}
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={handleBackClick}
          >
            {t('common.back', 'Retour')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
