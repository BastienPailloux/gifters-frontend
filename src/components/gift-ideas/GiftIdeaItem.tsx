import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/forms/Button';
import StatusTag from '../common/display/StatusTag';
import { GiftIdeaItemProps } from '../../types/gift-ideas';
import { GiftStatus } from '../../types/ui';

/**
 * Composant qui affiche une idée de cadeau avec son statut
 * Peut être utilisé dans différentes pages (Groupes, Mes Cadeaux, etc.)
 */
const GiftIdeaItem: React.FC<GiftIdeaItemProps> = ({ gift, onViewGift, hideStatus = false }) => {
  const { t } = useTranslation('gifts');

  // Formatage du prix pour l'affichage
  const formatPrice = (price?: number): string => {
    if (price === undefined || price === null) return '';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{gift.title}</p>
          {!hideStatus && <StatusTag status={gift.status as GiftStatus} />}
        </div>
        <p className="text-sm text-gray-500">
          {gift.recipients && gift.recipients.length > 0
            ? `${t('gifts:giftIdeas.for')} ${gift.recipients.map(r => r.name).join(', ')}`
            : gift.for_user_name && `${t('gifts:giftIdeas.for')} ${gift.for_user_name}`}
          {gift.price ? ` • ${formatPrice(Number(gift.price))}` : ''}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewGift(gift.id)}
      >
        {t('common:view')}
      </Button>
    </div>
  );
};

export default GiftIdeaItem;
