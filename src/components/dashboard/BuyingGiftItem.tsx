import React from 'react';
import { useTranslation } from 'react-i18next';
import FlatButton from '../common/forms/FlatButton';

export interface GiftIdea {
  id: string;
  title: string;
  for_user_name: string;
  group_name: string;
  status: 'proposed' | 'buying' | 'bought';
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
      <div>
        <span className="text-sm font-medium text-gray-900">
          {gift.title}
        </span>
        <p className="text-sm text-gray-500">
          {t('dashboard.for')} {gift.for_user_name} • {gift.group_name}
        </p>
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
