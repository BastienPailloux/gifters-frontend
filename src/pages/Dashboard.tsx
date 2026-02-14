import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaGift, FaPlus } from 'react-icons/fa';
import DashboardSummaryCard from '../components/dashboard/DashboardSummaryCard';
import QuickActionsList from '../components/dashboard/QuickActionsList';
import ActionBanner from '../components/common/display/ActionBanner';
import { GiftIdeaFormModal } from '../components/gift-ideas/GiftIdeaFormModal';
import { SEO } from '../components/common/seo';
import { groupService, membershipService } from '../services/api';

const Dashboard: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // État pour le modal de création de cadeau
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState<Array<{id: string; name: string; email?: string}>>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Fonction pour charger les membres des groupes
  const fetchGroupMembers = useCallback(async () => {
    if (!user) return;

    setIsLoadingMembers(true);
    try {
      const uniqueMembers = new Map<string, {id: string; name: string; email?: string}>();

      // Récupérer tous les groupes de l'utilisateur
      const groupsResponse = await groupService.getGroups();

      if (groupsResponse) {
        // Pour chaque groupe, récupérer ses membres
        const allMembersPromises = groupsResponse.map(async (group: {id: string}) => {
          const membersResponse = await membershipService.getGroupMembers(group.id);
          return membersResponse || [];
        });

        const allMembersArrays = await Promise.all(allMembersPromises);

        // Fusionner et dédupliquer
        allMembersArrays.flat().forEach(member => {
          const memberId = String(member.id || member.user_id);
          if (!uniqueMembers.has(memberId)) {
            uniqueMembers.set(memberId, {
              id: memberId,
              name: member.name || member.user_name,
              email: member.email || member.user_email
            });
          }
        });
      }

      // Toujours inclure l'utilisateur courant
      if (!uniqueMembers.has(String(user.id))) {
        uniqueMembers.set(String(user.id), {
          id: String(user.id),
          name: user.name,
          email: user.email
        });
      }

      setGroupMembers(Array.from(uniqueMembers.values()));
    } catch (err) {
      console.error('Error fetching group members:', err);
    } finally {
      setIsLoadingMembers(false);
    }
  }, [user]);

  // Ouvrir le modal et charger les membres
  const handleOpenGiftModal = useCallback(async () => {
    await fetchGroupMembers();
    setIsGiftModalOpen(true);
  }, [fetchGroupMembers]);

  // Fermer le modal
  const handleCloseGiftModal = () => {
    setIsGiftModalOpen(false);
  };

  // Après création réussie, rediriger vers la page des cadeaux
  const handleGiftCreated = () => {
    setIsGiftModalOpen(false);
    navigate('/gifts');
  };

  return (
    <div className="py-6 overflow-y-auto h-full transition-all duration-300 ease-in-out">
      <SEO translationKey="dashboard" />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out">
        {/* Bouton principal pour créer une idée cadeau */}
        <ActionBanner
          className="mb-8"
          title={t('dashboard:createGift.title')}
          description={t('dashboard:createGift.description')}
          icon={<FaGift className="h-5 w-5 sm:h-7 sm:w-7 text-white" />}
          actionIcon={<FaPlus className="h-5 w-5" />}
          onClick={handleOpenGiftModal}
        />

        {/* Carte principale du dashboard avec le résumé */}
        <DashboardSummaryCard user={user} />

        {/* Actions rapides */}
        <QuickActionsList className="mt-8" />
      </div>

      {/* Modal de création de cadeau */}
      <GiftIdeaFormModal
        isOpen={isGiftModalOpen}
        onClose={handleCloseGiftModal}
        groupMembers={groupMembers}
        onSuccess={handleGiftCreated}
        mode="create"
      />
    </div>
  );
};

export default Dashboard;
