import React from 'react';
import { useTranslation } from 'react-i18next';
import { AddGroupCardProps } from '../../types/groups';

/**
 * Composant qui affiche une carte "Ajouter un groupe"
 * Affiche un design distinctif avec une icône + et des textes explicatifs
 */
const AddGroupCard: React.FC<AddGroupCardProps> = ({ onClick, className = '' }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-center justify-center py-6 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${className}`}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-900">{t('groups.createNew')}</p>
        <p className="mt-1 text-xs text-gray-500">{t('groups.createNewSubtitle')}</p>
      </div>
    </div>
  );
};

export default AddGroupCard;
