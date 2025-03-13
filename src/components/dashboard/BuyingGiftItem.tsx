import React from 'react';
import { useTranslation } from 'react-i18next';
import FlatButton from '../common/forms/FlatButton';
import StatusTag, { GiftStatus } from '../common/display/StatusTag';

export interface GiftIdea {
  id: string;
  title: string;
  for_user_name: string;
  group_name: string;
  status: GiftStatus;
}

interface BuyingGiftItemProps {
  gift: GiftIdea;
  onMarkAsBought: (giftId: string) => void;
  isProcessing?: boolean;
}

const BuyingGiftItem: React.FC<BuyingGiftItemProps> = ({
  gift,
  onMarkAsBought,
  isProcessing = false
}) => {
  const { t } = useTranslation();

  return (
    <li className="bg-gray-50 p-3 rounded-md">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {gift.title}
            </span>
            <StatusTag status={gift.status} size="small" />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {t('dashboard.for')} {gift.for_user_name} • {gift.group_name}
          </p>
        </div>
      </div>
      <div className="mt-2 flex gap-4 items-center">
        <FlatButton
          asLink
          href={`/gift_ideas/${gift.id}`}
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
