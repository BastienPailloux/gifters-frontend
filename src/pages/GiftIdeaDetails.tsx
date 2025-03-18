import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { giftIdeaService } from '../services/api';
import Button from '../components/common/forms/Button';
import PageHeader from '../components/common/layout/PageHeader';
import GiftIdeaDetailCard from '../components/gift-ideas/GiftIdeaDetailCard';
import useAuth from '../hooks/useAuth';
import { GiftStatus, ExtendedGiftIdea } from '../types';
import { toast } from '../utils/toast';
import { FaEdit, FaTrash } from 'react-icons/fa';

const GiftIdeaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [giftIdea, setGiftIdea] = useState<ExtendedGiftIdea | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  // La modal d'édition sera implémentée dans une tâche future
  // const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // Formatage du prix en euros
  const formatPrice = (price?: number) => {
    if (!price) return '';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // Récupérer les détails de l'idée cadeau
  useEffect(() => {
    const fetchGiftIdeaDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await giftIdeaService.getGiftIdea(id);
        setGiftIdea(response.giftIdea as ExtendedGiftIdea);
      } catch (error) {
        console.error('Error fetching gift idea details:', error);
        setError(t('common.error') || 'Failed to load gift idea details');
      } finally {
        setLoading(false);
      }
    };

    fetchGiftIdeaDetails();
  }, [id, t]);

  // Gérer l'action "Je vais l'acheter"
  const handleMarkAsBuying = async () => {
    if (!id) return;

    try {
      const response = await giftIdeaService.markAsBuying(id);
      setGiftIdea(response.giftIdea as ExtendedGiftIdea);
    } catch (error) {
      console.error('Error marking gift as buying:', error);
      alert(t('giftIdeas.errorMarkingAsBuying'));
    }
  };

  // Gérer l'action "J'ai acheté"
  const handleMarkAsBought = async () => {
    if (!id) return;

    try {
      const response = await giftIdeaService.markAsBought(id);
      setGiftIdea(response.giftIdea as ExtendedGiftIdea);
    } catch (error) {
      console.error('Error marking gift as bought:', error);
      alert(t('giftIdeas.errorMarkingAsBought'));
    }
  };

  // Gérer la suppression de l'idée cadeau
  const handleDeleteGiftIdea = async () => {
    if (!id || !window.confirm(t('giftIdeas.confirmDelete'))) return;

    setIsDeleting(true);
    try {
      await giftIdeaService.deleteGiftIdea(id);
      // Si la suppression réussit, naviguer vers la page de groupe ou le dashboard
      navigate(-1);
      // Notify successful deletion
      toast.success(t('giftIdeas.deleteSuccess'));
    } catch (error) {
      console.error('Error deleting gift idea:', error);
      toast.error(t('giftIdeas.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Ouvrir la modal d'édition (à implémenter dans une tâche future)
  const handleEditGiftIdea = () => {
    // La modal d'édition sera implémentée dans une tâche future
    // Pour l'instant, afficher juste une alerte
    alert(t('giftIdeas.editFeatureComingSoon'));
    // setIsEditModalOpen(true);
  };

  // Retourner à la liste des cadeaux du groupe
  const handleBackToGroup = () => {
    navigate(-1);
  };

  // Vérifier si l'utilisateur peut modifier ou supprimer l'idée cadeau
  const canEditOrDelete = (): boolean => {
    if (!giftIdea || !user) return false;

    // L'utilisateur peut modifier/supprimer s'il est le créateur de l'idée
    const isCreator = giftIdea.created_by_id === user.id;

    // Ou s'il est l'acheteur actuel
    const isBuyer = giftIdea.buyer_id === user.id;

    return isCreator || isBuyer;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-lg">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-10">
        <p className="text-lg text-red-600">{error}</p>
        <Button variant="outline" onClick={handleBackToGroup} className="mt-4">
          {t('common.back')}
        </Button>
      </div>
    );
  }

  if (!giftIdea) {
    return (
      <div className="flex flex-col items-center py-10">
        <p className="text-lg">{t('giftIdeas.notFound')}</p>
        <Button variant="outline" onClick={handleBackToGroup} className="mt-4">
          {t('common.back')}
        </Button>
      </div>
    );
  }

  // Préparer les actions pour le PageHeader
  const headerActions = canEditOrDelete() ? (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleEditGiftIdea}
        className="flex items-center gap-1"
      >
        <FaEdit className="h-4 w-4" />
        {t('common.edit')}
      </Button>

      <Button
        variant="danger"
        onClick={handleDeleteGiftIdea}
        disabled={isDeleting}
        className="flex items-center gap-1"
      >
        {isDeleting ? (
          <>
            <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
            {t('common.deleting')}
          </>
        ) : (
          <>
            <FaTrash className="h-4 w-4" />
            {t('common.delete')}
          </>
        )}
      </Button>
    </div>
  ) : null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title={giftIdea.title}
          onBackClick={handleBackToGroup}
          className="mb-0"
          showBackButton={true}
          status={giftIdea.status as GiftStatus}
        />
        {headerActions}
      </div>

      <GiftIdeaDetailCard
        giftIdea={giftIdea}
        currentUser={user}
        onMarkAsBuying={handleMarkAsBuying}
        onMarkAsBought={handleMarkAsBought}
        formatPrice={formatPrice}
      />

      {/* La modal d'édition sera implémentée dans une future tâche */}
      {/* {isEditModalOpen && (
        <GiftIdeaEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          giftIdea={giftIdea}
          onGiftIdeaUpdated={(updatedGiftIdea) => setGiftIdea(updatedGiftIdea)}
        />
      )} */}
    </div>
  );
};

export default GiftIdeaDetails;
