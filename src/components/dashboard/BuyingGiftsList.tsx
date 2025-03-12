import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import FlatButton from '../common/forms/FlatButton';
import { FaChevronRight } from 'react-icons/fa';
import BuyingGiftItem, { GiftIdea } from './BuyingGiftItem';
import { giftIdeaService } from '../../services/api';
import useAsyncData from '../../hooks/useAsyncData';

// Type pour la structure des données de l'API
interface ApiGiftIdea {
  id: number | string;
  title: string;
  status: string;
  forUser?: { id: number | string; name: string };
  forUserName?: string;
  groupName?: string;
}

// Type pour la réponse API
interface ApiResponse {
  giftIdeas: ApiGiftIdea[];
}

interface BuyingGiftsListProps {
  maxGifts?: number;
}

/**
 * Composant qui affiche une liste des cadeaux en cours d'achat
 */
const BuyingGiftsList: React.FC<BuyingGiftsListProps> = ({ maxGifts = 5 }) => {
  const { t } = useTranslation();

  // Utiliser un hook personnalisé pour gérer le chargement asynchrone des données
  const {
    data: response,
    loading,
    error,
    refetch: fetchGifts
  } = useAsyncData<ApiResponse>(giftIdeaService.getBuyingGiftIdeas);

  // Marquer un cadeau comme acheté
  const handleMarkAsBought = async (giftId: string) => {
    try {
      await giftIdeaService.markAsBought(giftId);
      fetchGifts(); // Rafraîchir les données après l'action
    } catch (error) {
      console.error('Error marking gift as bought:', error);
    }
  };

  // Traiter et mapper les données pour l'affichage
  const buyingGifts = useMemo(() => {
    if (!response?.giftIdeas) return [];

    return response.giftIdeas.map((gift: ApiGiftIdea): GiftIdea => ({
      id: String(gift.id),
      title: gift.title,
      for_user_name: gift.forUser?.name || gift.forUserName || t('common.unknownUser'),
      group_name: gift.groupName || t('common.defaultGroup'),
      status: gift.status as 'proposed' | 'buying' | 'bought'
    }));
  }, [response, t]);

  // Afficher un spinner pendant le chargement
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500" />
      </div>
    );
  }

  // Afficher un message d'erreur en cas de problème
  if (error) {
    return (
      <div>
        <p className="text-red-500">{t('dashboard.errors.loadingGifts')}</p>
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
            <BuyingGiftItem
              key={gift.id}
              gift={gift}
              onMarkAsBought={handleMarkAsBought}
            />
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
