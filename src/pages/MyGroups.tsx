import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../services/api';
import useAuth from '../hooks/useAuth';
import PageHeader from '../components/common/layout/PageHeader';
import Card from '../components/common/display/Card';
import Button from '../components/common/forms/Button';
import { Group } from '../types/groups';
import GroupEditModal from '../components/groups/GroupEditModal';

/**
 * Page "Mes Groupes" qui affiche tous les groupes de l'utilisateur
 * et inclut un élément pour ajouter rapidement un nouveau groupe
 */
const MyGroups: React.FC = () => {
  const { t } = useTranslation();
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
      if (response) {
        setGroups(response);
      }
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

  // Rendu d'un groupe
  const renderGroupItem = (group: Group) => (
    <div className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-md px-3 transition-colors duration-200" key={group.id}>
      <div>
        <p className="text-sm font-medium text-gray-900">{group.name}</p>
        {group.description && (
          <p className="text-sm text-gray-500 truncate max-w-xs">{group.description}</p>
        )}
        <p className="text-xs text-gray-400">
          {group.member_count === 1
            ? t('groups.memberCount.singular', { count: 1 })
            : t('groups.memberCount.plural', { count: group.member_count || 0 })}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewGroup(group.id)}
      >
        {t('common.view')}
      </Button>
    </div>
  );

  // Rendu d'un élément "Ajouter un groupe"
  const renderAddGroupItem = () => (
    <div
      className="flex items-center justify-center py-6 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={handleCreateGroup}
    >
      <div className="text-center">
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-900">{t('groups.createNew')}</p>
        <p className="mt-1 text-xs text-gray-500">{t('groups.createNewSubtitle')}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-4">
        <PageHeader title={t('groups.myGroups')} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <PageHeader title={t('groups.myGroups')} />
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
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

      <Card>
        <div className="p-4 divide-y divide-gray-200">
          {groups.length === 0 && !isLoading ? (
            <p className="text-gray-500 p-4 text-center">
              {t('groups.noGroups')}
            </p>
          ) : (
            groups.map(group => renderGroupItem(group))
          )}
        </div>
      </Card>

      <div className="mt-6">
        {renderAddGroupItem()}
      </div>

      {/* Modal pour créer un nouveau groupe */}
      {isCreateModalOpen && (
        <GroupEditModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onUpdate={handleGroupCreated}
          group={{ id: '', name: '', description: '' }}
        />
      )}
    </div>
  );
};

export default MyGroups;
