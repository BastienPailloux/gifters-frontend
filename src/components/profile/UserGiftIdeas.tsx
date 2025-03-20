import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import GiftIdeaItem from '../gift-ideas/GiftIdeaItem';
import { UserGiftIdeasProps } from '../../types';

const UserGiftIdeas: React.FC<UserGiftIdeasProps> = ({ userName, giftIdeas, isLoading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewGift = (giftId: string | number) => {
    navigate(`/gift-ideas/${giftId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('profile.giftIdeasFor', { name: userName })}
      </h2>

      {giftIdeas.length > 0 ? (
        <div className="space-y-4 divide-y divide-gray-200">
          {giftIdeas.map(gift => (
            <div key={gift.id} className="pt-4 first:pt-0">
              <GiftIdeaItem
                gift={gift}
                onViewGift={handleViewGift}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">{t('profile.noGiftIdeas')}</p>
      )}
    </div>
  );
};

export default UserGiftIdeas;
