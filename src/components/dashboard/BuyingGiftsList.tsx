import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FlatButton from '../common/forms/FlatButton';
import { FaChevronRight } from 'react-icons/fa';
import BuyingGiftItem, { GiftIdea } from './BuyingGiftItem';
import { giftIdeaService } from '../../services/api';

// Interface reflétant la structure des données de l'API avec les sérialiseurs
interface ApiGiftIdea {
  id: number | string;
  title: string;
  description?: string;
  price?: string | number;
  link?: string;
  imageUrl?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  forUserId?: number | string;
  createdById?: number | string;
  forUserName?: string;
  createdByName?: string;
  groupName?: string;
  // Les informations complètes sur les utilisateurs (si incluses par le sérialiseur)
  forUser?: {
    id: number | string;
    name: string;
    email?: string;
  };
  createdBy?: {
    id: number | string;
    name: string;
    email?: string;
  };
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
      setError(null);

      // Récupérer les cadeaux en cours d'achat
      const response = await giftIdeaService.getBuyingGiftIdeas();

      // Afficher la réponse pour le débogage
      console.log('API response for buying gifts:', response);

      // Traiter les données selon leur format
      let buyingItems: GiftIdea[] = [];

      // Gérer le cas où la réponse pourrait être dans response.data (avec Axios) ou directement dans response
      const giftData = response.data && Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response) ? response : []);

      // Mapper les données en tenant compte de la structure camelCase
      buyingItems = giftData.map((gift: ApiGiftIdea) => {
        // Pour l'utilisateur, on prend d'abord l'objet forUser complet,
        // sinon on crée un objet à partir du nom utilisateur
        const userObject = gift.forUser ||
          (gift.forUserName ? { name: gift.forUserName } : { name: t('common.unknownUser') });

        return {
          id: String(gift.id),
          title: gift.title,
          for_user: userObject,
          // On prend le nom de groupe s'il existe, sinon on utilise une valeur par défaut
          group_name: gift.groupName || t('common.defaultGroup'),
          // On s'assure que le statut est conforme aux valeurs attendues
          status: gift.status as 'proposed' | 'buying' | 'bought'
        };
      });

      setBuyingGifts(buyingItems);
    } catch (error) {
      console.error('Error fetching buying gifts:', error);
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
    } catch (error) {
      console.error('Error marking gift as bought:', error);
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
