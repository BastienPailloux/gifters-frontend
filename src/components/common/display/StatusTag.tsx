import React from 'react';
import { useTranslation } from 'react-i18next';
import ColorTag from './ColorTag';
import { GiftStatus, StatusTagProps } from '../../../types';

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

  // Convertir les tailles du format sm/md/lg vers small/medium/large
  const convertSize = (size?: 'sm' | 'md' | 'lg') => {
    if (!size) return undefined;
    const sizeMap: Record<'sm' | 'md' | 'lg', 'small' | 'medium' | 'large'> = {
      'sm': 'small',
      'md': 'medium',
      'lg': 'large'
    };
    return sizeMap[size];
  };

  return (
    <ColorTag
      text={getStatusText(status)}
      color={getStatusColor(status)}
      className={className}
      size={convertSize(size)}
    />
  );
};

export default StatusTag;
