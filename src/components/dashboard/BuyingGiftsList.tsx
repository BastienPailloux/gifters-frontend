import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FlatButton from '../common/forms/FlatButton';
import { FaChevronRight } from 'react-icons/fa';
import BuyingGiftItem, { GiftIdea } from './BuyingGiftItem';
import { giftIdeaService } from '../../services/api';
import useAsyncData from '../../hooks/useAsyncData';
import CelebrationModal from '../common/modals/CelebrationModal';

// Type pour la structure des données de l'API
interface ApiGiftIdea {
  id: number | string;
  title: string;
  status: string;
  forUser?: { id: number | string; name: string } | string;
  forUserName?: string;
  groupName?: string;
  group?: { id: number | string; name: string } | string;
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
  console.log('BuyingGiftsList - Composant rendu');

  const { t } = useTranslation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingGiftId, setProcessingGiftId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationGift, setCelebrationGift] = useState<GiftIdea | null>(null);

  // Utiliser un hook personnalisé pour gérer le chargement asynchrone des données
  const {
    data: response,
    loading,
    error,
    refetch: fetchGifts
  } = useAsyncData<ApiResponse>(giftIdeaService.getBuyingGiftIdeas);

  // Log immédiat après récupération des données
  console.log('BuyingGiftsList - État actuel:', {
    hasResponse: !!response,
    hasGiftIdeas: !!response?.giftIdeas,
    loading,
    error
  });

  // Pour le débogage - afficher la structure des données reçues
  useEffect(() => {
    console.log('BuyingGiftsList - useEffect pour les données déclenché');

    if (response) {
      console.log('BuyingGiftsList - response existe:', response);
    }

    if (response?.giftIdeas) {
      console.log('Données reçues de l\'API:', response.giftIdeas);
    } else if (response) {
      console.log('Données reçues de l\'API sont vides ou mal structurées:', response);
    }
  }, [response]);

  // Vérifier la structure de la réponse API une fois lors du montage du composant
  useEffect(() => {
    console.log('BuyingGiftsList - useEffect au montage déclenché');

    // Faire un appel manuel à l'API pour vérifier la structure
    const checkApiDirectly = async () => {
      try {
        console.log('BuyingGiftsList - Appel direct à l\'API...');
        const data = await giftIdeaService.getBuyingGiftIdeas();
        console.log('BuyingGiftsList - Réponse directe de l\'API:', data);
      } catch (err) {
        console.error('BuyingGiftsList - Erreur lors de l\'appel direct à l\'API:', err);
      }
    };

    checkApiDirectly();
  }, []);

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
    console.log('BuyingGiftsList - useMemo pour mapper les cadeaux déclenché');

    if (!response?.giftIdeas) {
      console.log('BuyingGiftsList - Pas de giftIdeas à mapper');
      return [];
    }

    console.log('BuyingGiftsList - Mapping de', response.giftIdeas.length, 'cadeaux');

    const mappedGifts = response.giftIdeas.map((gift: ApiGiftIdea): GiftIdea => {
      // Débogage des propriétés individuelles
      console.log('Gift data:', {
        id: gift.id,
        title: gift.title,
        forUser: gift.forUser,
        forUserName: gift.forUserName,
        groupName: gift.groupName,
        group: gift.group
      });

      // Déterminer le nom de l'utilisateur avec une logique plus robuste
      let recipientName = t('common.unknownUser');
      if (gift.forUser && typeof gift.forUser === 'object' && gift.forUser.name) {
        recipientName = gift.forUser.name;
      } else if (gift.forUserName) {
        recipientName = gift.forUserName;
      } else if (gift.forUser && typeof gift.forUser === 'string') {
        // Si forUser est une chaîne, cela pourrait être directement le nom
        recipientName = gift.forUser as string;
      }

      // Déterminer le nom du groupe avec une logique plus robuste
      let groupName = t('common.defaultGroup');
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
        group_name: groupName,
        status: gift.status as 'proposed' | 'buying' | 'bought'
      };
    });

    // Débogage des données transformées
    console.log('Mapped gifts:', mappedGifts);

    return mappedGifts;
  }, [response, t]);

  // Gérer la fermeture de la modal de célébration
  const handleCloseCelebration = () => {
    setShowCelebration(false);
    setCelebrationGift(null);
  };

  // Log avant le rendu conditionnel
  console.log('BuyingGiftsList - État avant rendu conditionnel:', { loading, error, giftsCount: buyingGifts.length });

  // Afficher un spinner pendant le chargement
  if (loading) {
    console.log('BuyingGiftsList - Affichage du spinner de chargement');
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500" />
      </div>
    );
  }

  // Afficher un message d'erreur en cas de problème
  if (error) {
    console.log('BuyingGiftsList - Affichage de l\'erreur:', error);
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

  console.log('BuyingGiftsList - Rendu final avec', buyingGifts.length, 'cadeaux');

  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-4">
        {t('dashboard.buyingGifts')}
      </h3>

      {actionError && (
        <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded">
          {actionError}
          <button
            className="ml-2 underline"
            onClick={() => setActionError(null)}
          >
            {t('common.dismiss')}
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
              isProcessing={processingGiftId === gift.id}
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
