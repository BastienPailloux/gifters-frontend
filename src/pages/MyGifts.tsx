import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { giftIdeaService, groupService, membershipService } from '../services/api';
import useAuth from '../hooks/useAuth';
import PageHeader from '../components/common/layout/PageHeader';
import Card from '../components/common/display/Card';
import Button from '../components/common/forms/Button';
import ToggleSelect from '../components/common/forms/ToggleSelect';
import GiftIdeaItem from '../components/gift-ideas/GiftIdeaItem';
import { GiftIdeaFormModal } from '../components/gift-ideas/GiftIdeaFormModal';
import { ApiGiftIdea } from '../types/gift-ideas';
import { ToggleOption } from '../types/ui';
import { SEO } from '../components/common/seo';

/**
 * Page "Mes Cadeaux" qui affiche les différentes catégories de cadeaux
 * - Idées cadeaux suggérées pour l'utilisateur
 * - Idées cadeaux suggérées par l'utilisateur pour d'autres
 * - Idées cadeaux en cours d'achat par l'utilisateur
 * - Cadeaux achetés par l'utilisateur
 */
const MyGifts: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Types de catégories disponibles
  type CategoryType = 'wishlist' | 'suggestions' | 'buying' | 'bought';

  // Catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('wishlist');

  // Options pour le toggle select
  const categoryOptions: ToggleOption<CategoryType>[] = [
    { value: 'wishlist', label: t('myGifts.myWishlist') },
    { value: 'suggestions', label: t('myGifts.mySuggestions') },
    { value: 'buying', label: t('myGifts.buyingGifts') },
    { value: 'bought', label: t('myGifts.boughtGifts') },
  ];

  // États pour stocker les différentes catégories de cadeaux
  const [myWishlist, setMyWishlist] = useState<ApiGiftIdea[]>([]);
  const [mySuggestions, setMySuggestions] = useState<ApiGiftIdea[]>([]);
  const [buyingGifts, setBuyingGifts] = useState<ApiGiftIdea[]>([]);
  const [boughtGifts, setBoughtGifts] = useState<ApiGiftIdea[]>([]);

  // État pour stocker les membres des groupes de l'utilisateur
  const [groupMembers, setGroupMembers] = useState<Array<{id: string; name: string; email?: string}>>([]);

  // État pour le chargement des données
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // État pour l'ouverture du modal de création de cadeau
  const [isGiftFormModalOpen, setIsGiftFormModalOpen] = useState<boolean>(false);

  // Fonction pour charger les membres des groupes de l'utilisateur
  const fetchGroupMembers = async () => {
    if (!user) return;

    try {
      // Récupérer tous les groupes de l'utilisateur
      const groupsResponse = await groupService.getGroups();

      if (groupsResponse) {
        // Pour chaque groupe, récupérer ses membres
        const allMembersPromises = groupsResponse.map(async (group: {id: string}) => {
          const membersResponse = await membershipService.getGroupMembers(group.id);
          return membersResponse || [];
        });

        // Attendre que toutes les requêtes soient terminées
        const allMembersArrays = await Promise.all(allMembersPromises);

        // Fusionner tous les membres en un seul tableau et dédupliquer par ID
        const uniqueMembers = new Map();
        allMembersArrays.flat().forEach(member => {
          if (!uniqueMembers.has(member.user_id)) {
            uniqueMembers.set(member.user_id, {
              id: member.user_id,
              name: member.name || member.user_name,
              email: member.email || member.user_email
            });
          }
        });

        setGroupMembers(Array.from(uniqueMembers.values()));
      }
    } catch (err) {
      console.error('Error fetching group members:', err);
    }
  };

  // Fonction pour charger les données de cadeaux
  const fetchMyGifts = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // 1. Récupérer les idées cadeaux suggérées pour l'utilisateur (ma wishlist)
      const wishlistResponse = await giftIdeaService.getGiftIdeas();
      if (wishlistResponse && wishlistResponse.giftIdeas) {
        // Filtrer pour ne garder que les cadeaux où l'utilisateur est destinataire
        const myWishlistGifts = wishlistResponse.giftIdeas.filter((gift: ApiGiftIdea) => {
          return gift.recipients && gift.recipients.some(recipient => recipient.id === user.id);
        });
        setMyWishlist(myWishlistGifts);
      }

      // 2. Récupérer les idées cadeaux suggérées par l'utilisateur pour d'autres (avec statut proposed ou buying)
      const suggestionsResponse = await giftIdeaService.getGiftIdeasByCreator(user.id, ['proposed', 'buying']);
      if (suggestionsResponse && suggestionsResponse.giftIdeas) {
        // Filtrer pour ne garder que les cadeaux qui ne sont pas destinés à l'utilisateur lui-même
        const mySuggestionGifts = suggestionsResponse.giftIdeas.filter((gift: ApiGiftIdea) => {
          return !gift.recipients || !gift.recipients.some(recipient => recipient.id === user.id);
        });
        setMySuggestions(mySuggestionGifts);
      }

      // 3. Récupérer les idées cadeaux en cours d'achat par l'utilisateur
      const buyingResponse = await giftIdeaService.getGiftIdeasByBuyer(user.id, undefined, ['buying']);
      if (buyingResponse && buyingResponse.giftIdeas) {
        setBuyingGifts(buyingResponse.giftIdeas);
      }

      // 4. Récupérer les cadeaux achetés par l'utilisateur
      const boughtResponse = await giftIdeaService.getGiftIdeasByBuyer(user.id, undefined, ['bought']);
      if (boughtResponse && boughtResponse.giftIdeas) {
        setBoughtGifts(boughtResponse.giftIdeas);
      }

    } catch (err) {
      console.error('Error fetching gifts:', err);
      setError(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement des données au montage du composant
  useEffect(() => {
    fetchMyGifts();
    fetchGroupMembers(); // Charger les membres des groupes
  }, [user, t]);

  // Fonction pour naviguer vers les détails d'un cadeau
  const handleViewGift = (giftId: string | number) => {
    navigate(`/gift-ideas/${giftId}`);
  };

  // Fonction pour ouvrir le modal d'ajout de cadeau
  const handleAddGift = () => {
    setIsGiftFormModalOpen(true);
  };

  // Fonction appelée après l'ajout d'un cadeau
  const handleGiftAdded = () => {
    setIsGiftFormModalOpen(false);
    // Recharger les données
    fetchMyGifts();
  };

  // Fonction pour changer de catégorie
  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  // Rendu d'une section de cadeaux
  const renderGiftSection = (title: string, gifts: ApiGiftIdea[], emptyMessage: string) => (
    <Card className="mb-6">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">{title}</h2>
      {gifts.length === 0 ? (
        <p className="text-gray-500 p-4">{emptyMessage}</p>
      ) : (
        <ul className="p-4 divide-y divide-gray-200">
          {gifts.map((gift) => (
            <li key={String(gift.id)}>
              <GiftIdeaItem
                gift={gift}
                onViewGift={handleViewGift}
                hideStatus={selectedCategory === 'wishlist'}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );

  // Obtenir les données de la catégorie sélectionnée
  const getCurrentCategoryData = (): { title: string; gifts: ApiGiftIdea[]; emptyMessage: string } => {
    switch (selectedCategory) {
      case 'wishlist':
        return {
          title: t('myGifts.myWishlist'),
          gifts: myWishlist,
          emptyMessage: t('myGifts.noWishlist')
        };
      case 'suggestions':
        return {
          title: t('myGifts.mySuggestions'),
          gifts: mySuggestions,
          emptyMessage: t('myGifts.noSuggestions')
        };
      case 'buying':
        return {
          title: t('myGifts.buyingGifts'),
          gifts: buyingGifts,
          emptyMessage: t('myGifts.noBuyingGifts')
        };
      case 'bought':
        return {
          title: t('myGifts.boughtGifts'),
          gifts: boughtGifts,
          emptyMessage: t('myGifts.noBoughtGifts')
        };
      default:
        return {
          title: t('myGifts.myWishlist'),
          gifts: myWishlist,
          emptyMessage: t('myGifts.noWishlist')
        };
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <SEO translationKey="seo.myGifts" />
        <PageHeader title={t('giftIdeas.title')} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <SEO translationKey="seo.myGifts" />
        <PageHeader title={t('giftIdeas.title')} />
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          {error}
        </div>
      </div>
    );
  }

  // Obtenir les données de la catégorie actuelle
  const currentCategory = getCurrentCategoryData();

  return (
    <div className="p-4">
      <SEO translationKey="seo.myGifts" />
      <PageHeader
        title={t('giftIdeas.title')}
        actions={
          <Button variant="primary" onClick={handleAddGift}>
            {t('giftIdeas.addGiftIdea')}
          </Button>
        }
      />

      <div className="my-6">
        {/* Sélecteur de catégorie */}
        <ToggleSelect
          options={categoryOptions}
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="mb-6"
        />

        {/* Affichage de la catégorie sélectionnée */}
        {renderGiftSection(
          currentCategory.title,
          currentCategory.gifts,
          currentCategory.emptyMessage
        )}
      </div>

      {/* Modal pour ajouter une idée de cadeau */}
      <GiftIdeaFormModal
        isOpen={isGiftFormModalOpen}
        onClose={() => setIsGiftFormModalOpen(false)}
        mode="create"
        groupMembers={groupMembers}
        onSuccess={handleGiftAdded}
      />
    </div>
  );
};

export default MyGifts;
