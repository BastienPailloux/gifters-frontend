import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { giftIdeaService, membershipService } from '../services/api';
import Button from '../components/common/forms/Button';
import PageHeader from '../components/common/layout/PageHeader';
import GiftIdeaDetailCard from '../components/gift-ideas/GiftIdeaDetailCard';
import { GiftIdeaFormModal } from '../components/gift-ideas/GiftIdeaFormModal';
import useAuth from '../hooks/useAuth';
import { ExtendedGiftIdea } from '../types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmationModal from '../components/common/modals/ConfirmationModal';
import { SEO } from '../components/common/seo';

const GiftIdeaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [giftIdea, setGiftIdea] = useState<ExtendedGiftIdea | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [groupMembers, setGroupMembers] = useState<Array<{ id: string; name: string; email?: string }>>([]);

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

        // Récupérer les membres du groupe pour la modal d'édition
        if (response.giftIdea.group_id) {
          try {
            const groupResponse = await membershipService.getGroupMembers(response.giftIdea.group_id);

            // Assurons-nous que tous les destinataires actuels sont disponibles comme options
            const members = groupResponse.members || [];

            // Si nous avons des destinataires dans l'idée cadeau
            if (response.giftIdea.recipients && response.giftIdea.recipients.length > 0) {
              // Créer un ensemble des IDs des membres déjà présents pour éviter les doublons
              const existingMemberIds = new Set(members.map((m: { id: string }) => m.id));

              // Ajouter les destinataires qui ne sont pas déjà dans la liste des membres
              response.giftIdea.recipients.forEach((recipient: { id: string; name: string }) => {
                if (!existingMemberIds.has(recipient.id)) {
                  members.push({
                    id: recipient.id,
                    name: recipient.name,
                    email: ''
                  });
                }
              });
            }

            setGroupMembers(members);
          } catch (error) {
            console.error('Error fetching group members:', error);
          }
        }
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
    }
  };

  // Gérer la suppression de l'idée cadeau
  const handleDeleteGiftIdea = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await giftIdeaService.deleteGiftIdea(id);
      // Si la suppression réussit, naviguer vers la page de groupe ou le dashboard
      navigate(-1);
    } catch (error) {
      console.error('Error deleting gift idea:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // Ouvrir la modal de confirmation de suppression
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // Fermer la modal de confirmation de suppression
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Ouvrir la modal d'édition
  const handleEditGiftIdea = () => {
    setIsEditModalOpen(true);
  };

  // Fermer la modal d'édition
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Retourner à la liste des cadeaux du groupe
  const handleBackToGroup = () => {
    navigate(-1);
  };

  // Rafraîchir les détails de l'idée après édition
  const handleGiftUpdated = async () => {
    if (!id) return;
    try {
      const response = await giftIdeaService.getGiftIdea(id);
      setGiftIdea(response.giftIdea as ExtendedGiftIdea);
    } catch (error) {
      console.error('Error refreshing gift details:', error);
    }
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
        <SEO translationKey="seo.giftIdea" />
        <p className="text-lg">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-10">
        <SEO translationKey="seo.giftIdea" />
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
        <SEO translationKey="seo.giftIdea" />
        <p className="text-lg">{t('giftIdeas.notFound')}</p>
        <Button variant="outline" onClick={handleBackToGroup} className="mt-4">
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {giftIdea && (
        <SEO
          title={giftIdea.title}
          description={giftIdea.description || t('giftIdea.noDescription')}
          image={giftIdea.image_url || undefined}
          type="product"
        />
      )}

      <PageHeader
        title={loading ? t('common.loading') : (giftIdea?.title || t('giftIdea.notFound'))}
        onBackClick={() => navigate(-1)}
        actions={
          canEditOrDelete() ? (
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
                onClick={openDeleteModal}
                disabled={isDeleting}
                className="flex items-center gap-1"
              >
                <FaTrash className="h-4 w-4" />
                {t('common.delete')}
              </Button>
            </div>
          ) : null
        }
      />

      <GiftIdeaDetailCard
        giftIdea={giftIdea}
        currentUser={user}
        onMarkAsBuying={handleMarkAsBuying}
        onMarkAsBought={handleMarkAsBought}
        formatPrice={formatPrice}
      />

      {isEditModalOpen && giftIdea && (
        <GiftIdeaFormModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          groupMembers={groupMembers}
          onSuccess={handleGiftUpdated}
          mode="edit"
          giftIdea={giftIdea}
        />
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title={t('giftIdeas.confirmDeleteTitle')}
        message={t('giftIdeas.confirmDeleteMessage')}
        onConfirm={handleDeleteGiftIdea}
        isLoading={isDeleting}
        confirmVariant="danger"
        confirmText={isDeleting ? t('common.deleting') : t('common.delete')}
      />
    </div>
  );
};

export default GiftIdeaDetails;
