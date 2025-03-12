import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/forms/Button';

export interface GiftIdea {
  id: string;
  title: string;
  for_user_name: string;
  price?: number;
  status: 'proposed' | 'buying' | 'bought';
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

  const getStatusTag = () => {
    switch (gift.status) {
      case 'proposed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {t('giftIdeas.statusProposed') || 'Proposed'}
          </span>
        );
      case 'buying':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {t('giftIdeas.statusBuying') || 'Buying'}
          </span>
        );
      case 'bought':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {t('giftIdeas.statusBought') || 'Bought'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{gift.title}</p>
          {getStatusTag()}
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
