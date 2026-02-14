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

  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [childrenGroups, setChildrenGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Fonction pour charger tous les groupes de l'utilisateur
  const fetchGroups = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Appel à l'API pour récupérer les groupes avec la structure hiérarchique
      const response = await groupService.getGroups(true);

      let userGroupsData: Group[] = [];
      let childrenGroupsData: Group[] = [];

      if (response) {
        // Format hiérarchique avec enfants
        if (response.children && Array.isArray(response.children)) {
          userGroupsData = response.groups || [];

          // Collecter tous les groupes des enfants
          response.children.forEach((child: { id: number; name: string; groups: Group[] }) => {
            if (child.groups && Array.isArray(child.groups)) {
              // Ajouter info sur l'enfant membre pour chaque groupe
              const childGroupsWithInfo = child.groups.map((group: Group) => ({
                ...group,
                childMemberName: child.name
              }));
              childrenGroupsData = [...childrenGroupsData, ...childGroupsWithInfo];
            }
          });

          // Dédupliquer les groupes des enfants (un groupe peut avoir plusieurs enfants membres)
          const uniqueChildrenGroups = new Map<string, Group>();
          childrenGroupsData.forEach(group => {
            if (!uniqueChildrenGroups.has(String(group.id))) {
              uniqueChildrenGroups.set(String(group.id), group);
            }
          });
          childrenGroupsData = Array.from(uniqueChildrenGroups.values());

          // Exclure les groupes où l'utilisateur est déjà membre
          const userGroupIds = new Set(userGroupsData.map(g => String(g.id)));
          childrenGroupsData = childrenGroupsData.filter(g => !userGroupIds.has(String(g.id)));
        }
        // Rétro-compatibilité : format simple
        else if (Array.isArray(response)) {
          userGroupsData = response;
        } else if (response.groups && Array.isArray(response.groups)) {
          userGroupsData = response.groups;
        }
      }

      setMyGroups(userGroupsData);
      setChildrenGroups(childrenGroupsData);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError(t('common:error'));
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
        <SEO translationKey="myGroups" />
        <PageHeader title={t('groups:myGroups')} />
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <SEO translationKey="myGroups" />
      <PageHeader
        title={t('groups:myGroups')}
        description={t('groups:myGroupsDescription')}
        actions={
          <Button
            variant="primary"
            onClick={handleCreateGroup}
          >
            {t('groups:createNew')}
          </Button>
        }
      />

      {/* Mes groupes */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('groups:myGroupsSection')}</h2>
        <GroupsList
          groups={myGroups}
          onViewGroup={handleViewGroup}
          isLoading={isLoading}
          emptyMessage={t('groups:noMyGroups')}
        />
      </div>

      <div className="m-6">
        <AddGroupCard onClick={handleCreateGroup} />
      </div>

      {/* Groupes de mes enfants */}
      {childrenGroups.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('groups:childrenGroupsSection')}</h2>
          <GroupsList
            groups={childrenGroups}
            onViewGroup={handleViewGroup}
            isLoading={false}
            emptyMessage=""
          />
        </div>
      )}

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
