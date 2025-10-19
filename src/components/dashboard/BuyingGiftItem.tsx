import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FlatButton from '../common/forms/FlatButton';
import StatusTag from '../common/display/StatusTag';
import { BuyingGiftItemProps, BuyingGift } from '../../types/gift-ideas';

// Exporter uniquement le type pour la rétrocompatibilité
export type { BuyingGift as GiftIdea };

const BuyingGiftItem: React.FC<BuyingGiftItemProps> = ({
  gift,
  onMarkAsBought,
  isProcessing = false
}) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const handleViewGift = () => {
    navigate(`/gift-ideas/${gift.id}`);
  };

  return (
    <li className="bg-gray-50 p-3 rounded-md">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {gift.title}
            </span>
            <StatusTag status={gift.status} size="sm" />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {t('dashboard.for')} {gift.recipients && gift.recipients.length > 0
              ? gift.recipients.map(r => r.name).join(', ')
              : gift.for_user_name}
          </p>
        </div>
      </div>
      <div className="mt-2 flex gap-4 items-center">
        <FlatButton
          onClick={handleViewGift}
          size="small"
        >
          {t('dashboard.viewGift')}
        </FlatButton>
        <FlatButton
          variant="secondary"
          size="small"
          onClick={() => onMarkAsBought(gift.id)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
              {t('common.processing')}
            </>
          ) : (
            t('dashboard.markAsBought')
          )}
        </FlatButton>
      </div>
    </li>
  );
};

export default BuyingGiftItem;
