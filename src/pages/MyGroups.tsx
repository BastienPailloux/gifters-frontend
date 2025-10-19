import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../services/api';
import useAuth from '../hooks/useAuth';
import PageHeader from '../components/common/layout/PageHeader';
import Button from '../components/common/forms/Button';
import { Group } from '../types/groups';
import GroupsList from '../components/groups/GroupsList';
import AddGroupCard from '../components/groups/AddGroupCard';
import GroupFormModal from '../components/groups/GroupFormModal';
import { SEO } from '../components/common/seo';

/**
 * Page "Mes Groupes" qui affiche tous les groupes de l'utilisateur
 * et inclut un élément pour ajouter rapidement un nouveau groupe
 */
const MyGroups: React.FC = () => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Fonction pour charger tous les groupes de l'utilisateur
  const fetchGroups = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Appel à l'API pour récupérer les groupes
      const response = await groupService.getGroups();

      // Gestion robuste de la réponse pour s'assurer que groups est toujours un tableau
      let groupsData: Group[] = [];

      if (response) {
        if (Array.isArray(response)) {
          // Si la réponse est déjà un tableau
          groupsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          // Si les données sont dans response.data
          groupsData = response.data;
        } else if (response.groups && Array.isArray(response.groups)) {
          // Si les données sont dans response.groups
          groupsData = response.groups;
        }
      }

      setGroups(groupsData);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement des groupes au montage du composant
  useEffect(() => {
    fetchGroups();
  }, [user, t]);

  // Fonction pour naviguer vers les détails d'un groupe
  const handleViewGroup = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  // Fonction pour ouvrir le modal de création de groupe
  const handleCreateGroup = () => {
    setIsCreateModalOpen(true);
  };

  // Fonction appelée après la création d'un groupe
  const handleGroupCreated = () => {
    setIsCreateModalOpen(false);
    // Recharger les groupes
    fetchGroups();
  };

  // Afficher seulement le message d'erreur si nécessaire
  if (error) {
    return (
      <div className="p-4">
        <SEO translationKey="seo.myGroups" />
        <PageHeader title={t('groups.myGroups')} />
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <SEO translationKey="seo.myGroups" />
      <PageHeader
        title={t('groups.myGroups')}
        description={t('groups.myGroupsDescription')}
        actions={
          <Button
            variant="primary"
            onClick={handleCreateGroup}
          >
            {t('groups.createNew')}
          </Button>
        }
      />

      <GroupsList
        groups={groups}
        onViewGroup={handleViewGroup}
        isLoading={isLoading}
        emptyMessage={t('groups.noGroups')}
      />

      <div className="mt-6">
        <AddGroupCard onClick={handleCreateGroup} />
      </div>

      {/* Modal pour créer un nouveau groupe */}
      {isCreateModalOpen && (
        <GroupFormModal
          mode="create"
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleGroupCreated}
          group={{ id: '', name: '', description: '' }}
        />
      )}
    </div>
  );
};

export default MyGroups;
