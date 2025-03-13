import React, { ReactNode } from 'react';
import BackButton from '../navigation/BackButton';

interface PageHeaderProps {
  title: string;
  description?: string;
  onBackClick?: () => void;
  actions?: ReactNode;
  className?: string;
  showBackButton?: boolean;
}

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
  showBackButton = true
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
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
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
