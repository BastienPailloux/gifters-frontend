import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/forms/Button';
import StatusTag, { GiftStatus } from '../common/display/StatusTag';

export interface GiftIdea {
  id: string;
  title: string;
  for_user_name: string;
  price?: number;
  status: GiftStatus;
}

interface GiftIdeaItemProps {
  gift: GiftIdea;
  onViewGift: (giftId: string) => void;
}

/**
 * Composant qui affiche une idée de cadeau avec son statut dans la page de détails du groupe
 */
const GiftIdeaItem: React.FC<GiftIdeaItemProps> = ({ gift, onViewGift }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{gift.title}</p>
          <StatusTag status={gift.status} />
        </div>
        <p className="text-sm text-gray-500">
          {t('giftIdeas.for') || 'For'}: {gift.for_user_name}
          {gift.price && ` • ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(gift.price)}`}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewGift(gift.id)}
      >
        {t('common.view') || 'View'}
      </Button>
    </div>
  );
};

export default GiftIdeaItem;
