import React from 'react';
import { useTranslation } from 'react-i18next';
import ColorTag from './ColorTag';

// Définir les types de statuts possibles
export type GiftStatus = 'proposed' | 'buying' | 'bought';

interface StatusTagProps {
  status: GiftStatus;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Composant pour afficher un tag coloré indiquant le statut d'une idée cadeau
 * Ce composant traduit les statuts en couleurs et textes, puis utilise ColorTag
 */
const StatusTag: React.FC<StatusTagProps> = ({
  status,
  className,
  size
}) => {
  const { t } = useTranslation();

  // Mapper les statuts aux couleurs
  const getStatusColor = (status: GiftStatus) => {
    switch (status) {
      case 'proposed':
        return 'blue';
      case 'buying':
        return 'yellow';
      case 'bought':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Obtenir le texte traduit pour le statut
  const getStatusText = (status: GiftStatus) => {
    return t(`giftIdeas.status${status.charAt(0).toUpperCase() + status.slice(1)}`);
  };

  return (
    <ColorTag
      text={getStatusText(status)}
      color={getStatusColor(status)}
      className={className}
      size={size}
    />
  );
};

export default StatusTag;
