import React from 'react';
import BackButton from '../navigation/BackButton';
import StatusTag from '../display/StatusTag';
import { PageHeaderProps } from '../../../types';

/**
 * Composant d'en-tête de page réutilisable
 * Affiche un titre, une description optionnelle, un bouton de retour et des actions
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  onBackClick,
  actions,
  className = '',
  showBackButton = true,
  status
}) => {
  return (
    <div className={`mb-8 flex justify-between items-center flex-wrap gap-4 ${className}`}>
      <div>
        {showBackButton && (
          <BackButton
            onClick={onBackClick}
            className="mb-4"
          />
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {status && <StatusTag status={status} />}
        </div>
        {description && (
          <p className="mt-2 text-gray-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
