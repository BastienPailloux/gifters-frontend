import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FlatButton from '../common/forms/FlatButton';
import { FaChevronRight } from 'react-icons/fa';
import BuyingGiftItem from './BuyingGiftItem';
import { giftIdeaService } from '../../services/api';
import useAsyncData from '../../hooks/useAsyncData';
import CelebrationModal from '../common/modals/CelebrationModal';
import { useAuth } from '../../contexts/AuthContext';
import {
  BuyingGift,
  BuyingGiftsListProps,
  ApiGiftIdea,
  ApiGiftIdeasResponse
} from '../../types/gift-ideas';

/**
 * Composant qui affiche une liste des cadeaux en cours d'achat
 */
const BuyingGiftsList: React.FC<BuyingGiftsListProps> = ({ maxGifts = 5 }) => {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingGiftId, setProcessingGiftId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationGift, setCelebrationGift] = useState<BuyingGift | null>(null);

  // Mémoriser la fonction de récupération des données pour éviter les rendus en boucle
  const fetchUserGifts = useCallback(async () => {
    if (!user) return { giftIdeas: [] };
    try {
      return await giftIdeaService.getGiftIdeasByBuyer(user.id, undefined, ['buying']);
    } catch (err) {
      console.error('BuyingGiftsList - Erreur lors de l\'appel à l\'API:', err);
      throw err;
    }
  }, [user]);

  // Utiliser un hook personnalisé pour gérer le chargement asynchrone des données
  const {
    data: response,
    loading,
    error,
    refetch: fetchGifts
  } = useAsyncData<ApiGiftIdeasResponse>(fetchUserGifts);

  // Annuler l'achat (en cours d'achat ou déjà marqué acheté)
  const handleCancelPurchase = async (giftId: string) => {
    try {
      setProcessingGiftId(giftId);
      setActionError(null);
      await giftIdeaService.cancelPurchase(giftId);
      fetchGifts();
    } catch (error) {
      console.error('Error cancelling purchase:', error);
      setActionError(t('dashboard:errors.cancellingPurchase'));
    } finally {
      setProcessingGiftId(null);
    }
  };

  // Marquer un cadeau comme acheté
  const handleMarkAsBought = async (giftId: string) => {
    try {
      setProcessingGiftId(giftId);
      setActionError(null);

      // Trouver le cadeau dans la liste pour l'utiliser dans la célébration
      const giftToMark = buyingGifts.find(gift => gift.id === giftId);

      // Appeler l'API pour marquer le cadeau comme acheté
      await giftIdeaService.markAsBought(giftId);

      // Mise à jour optimiste de l'interface utilisateur
      fetchGifts();

      // Afficher la modal de célébration si le cadeau a été trouvé
      if (giftToMark) {
        setCelebrationGift(giftToMark);
        setShowCelebration(true);
      }
    } catch (error) {
      console.error('Error marking gift as bought:', error);
      setActionError(t('dashboard.errors.markingGift'));
    } finally {
      setProcessingGiftId(null);
    }
  };

  // Traiter et mapper les données pour l'affichage
  const buyingGifts = useMemo(() => {

    if (!response?.giftIdeas) {
      return [];
    }

    const mappedGifts = response.giftIdeas.map((gift: ApiGiftIdea): BuyingGift => {

      // Déterminer le nom de l'utilisateur avec une logique plus robuste
      let recipientName = t('common:unknownUser');
      if (gift.forUser && typeof gift.forUser === 'object' && gift.forUser.name) {
        recipientName = gift.forUser.name;
      } else if (gift.forUserName) {
        recipientName = gift.forUserName;
      } else if (gift.forUser && typeof gift.forUser === 'string') {
        // Si forUser est une chaîne, cela pourrait être directement le nom
        recipientName = gift.forUser as string;
      }

      // Déterminer le nom du groupe avec une logique plus robuste
      let groupName = t('common:defaultGroup');
      if (gift.groupName) {
        groupName = gift.groupName;
      } else if (gift.group && typeof gift.group === 'object' && gift.group.name) {
        groupName = gift.group.name;
      } else if (gift.group && typeof gift.group === 'string') {
        // Si group est une chaîne, cela pourrait être directement le nom
        groupName = gift.group as string;
      }

      return {
        id: String(gift.id),
        title: gift.title,
        for_user_name: recipientName,
        recipients: gift.recipients?.map(r => ({
          id: String(r.id),
          name: r.name
        })),
        group_name: groupName,
        status: gift.status as 'proposed' | 'buying' | 'bought',
        can_cancel_purchase: gift.can_cancel_purchase ?? false
      };
    });

    return mappedGifts;
  }, [response, t]);

  // Gérer la fermeture de la modal de célébration
  const handleCloseCelebration = () => {
    setShowCelebration(false);
    setCelebrationGift(null);
  };

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
        <p className="text-red-500">{t('dashboard:errors.loadingGifts')}</p>
        <button
          className="mt-2 text-primary-600 hover:text-primary-800 text-sm font-medium"
          onClick={fetchGifts}
        >
          {t('common:retry')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-4">
        {t('dashboard:buyingGifts')}
      </h3>

      {actionError && (
        <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded">
          {actionError}
          <button
            className="ml-2 underline"
            onClick={() => setActionError(null)}
          >
            {t('common:dismiss')}
          </button>
        </div>
      )}

      {buyingGifts.length > 0 ? (
        <ul className="space-y-3">
          {buyingGifts.slice(0, maxGifts).map((gift) => (
            <BuyingGiftItem
              key={gift.id}
              gift={gift}
              onMarkAsBought={handleMarkAsBought}
              onCancelPurchase={handleCancelPurchase}
              isProcessing={processingGiftId === gift.id}
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">{t('dashboard:noBuyingGifts')}</p>
      )}

      <div className="mt-4">
        <FlatButton
          asLink
          href="/gifts"
          variant="primary"
          icon={<FaChevronRight className="h-3 w-3" />}
          iconPosition="right"
        >
          {t('dashboard:viewAllGifts')}
        </FlatButton>
      </div>

      {/* Modal de célébration */}
      {showCelebration && celebrationGift && (
        <CelebrationModal
          isOpen={showCelebration}
          onClose={handleCloseCelebration}
          giftTitle={celebrationGift.title}
          recipientName={celebrationGift.for_user_name}
        />
      )}
    </div>
  );
};

export default BuyingGiftsList;
