import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FlatButton from '../common/forms/FlatButton';
import { FaChevronRight } from 'react-icons/fa';
import BuyingGiftItem, { GiftIdea } from './BuyingGiftItem';
import { giftIdeaService } from '../../services/api';

interface ApiGiftIdea {
  id: string;
  title: string;
  for_user_name: string;
  group_name: string;
  status: string;
  [key: string]: unknown; // Pour les autres propriétés potentielles
}

interface BuyingGiftsListProps {
  maxGifts?: number;
}

const BuyingGiftsList: React.FC<BuyingGiftsListProps> = ({ maxGifts = 5 }) => {
  const { t } = useTranslation();
  const [buyingGifts, setBuyingGifts] = useState<GiftIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      // Récupérer les cadeaux en cours d'achat
      const buyingResponse = await giftIdeaService.getGiftIdeas();
      if (buyingResponse.data) {
        const buyingItems = buyingResponse.data
          .filter((gift: ApiGiftIdea) => gift.status === 'buying')
          .map((gift: ApiGiftIdea) => ({
            id: gift.id,
            title: gift.title,
            for_user_name: gift.for_user_name,
            group_name: gift.group_name,
            status: gift.status as 'new' | 'buying' | 'bought'
          }));
        setBuyingGifts(buyingItems);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching buying gifts:', err);
      setError(t('dashboard.errors.loadingGifts'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, [t]);

  // Fonction pour marquer un cadeau comme acheté
  const handleMarkAsBought = async (giftId: string) => {
    try {
      await giftIdeaService.markAsBought(giftId);
      // Mettre à jour la liste des cadeaux après avoir marqué comme acheté
      setBuyingGifts(prevGifts => prevGifts.filter(gift => gift.id !== giftId));
    } catch (err) {
      console.error('Error marking gift as bought:', err);
      setError(t('dashboard.errors.markingGift'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <button
          className="mt-2 text-primary-600 hover:text-primary-800 text-sm font-medium"
          onClick={fetchGifts}
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-4">
        {t('dashboard.buyingGifts')}
      </h3>

      {buyingGifts.length > 0 ? (
        <ul className="space-y-3">
          {buyingGifts.slice(0, maxGifts).map((gift) => (
            <BuyingGiftItem key={gift.id} gift={gift} onMarkAsBought={handleMarkAsBought} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">{t('dashboard.noBuyingGifts')}</p>
      )}

      <div className="mt-4">
        <FlatButton
          asLink
          href="/gifts"
          variant="primary"
          icon={<FaChevronRight className="h-3 w-3" />}
          iconPosition="right"
        >
          {t('dashboard.viewAllGifts')}
        </FlatButton>
      </div>
    </div>
  );
};

export default BuyingGiftsList;
