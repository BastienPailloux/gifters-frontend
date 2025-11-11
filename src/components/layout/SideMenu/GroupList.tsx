import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { groupService } from '../../../services/api';
import GroupItem from './GroupItem';
import { SideMenuGroup, GroupListProps, HierarchicalGroupsResponse, ChildWithGroups } from '../../../types';

const GroupList: React.FC<GroupListProps> = ({ onDataLoaded }) => {
  const { t } = useTranslation(['navigation', 'common']);
  const location = useLocation();
  const [groups, setGroups] = useState<SideMenuGroup[]>([]);
  const [children, setChildren] = useState<ChildWithGroups[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtenir l'ID du groupe actif à partir de l'URL
  const currentGroupId = location.pathname.startsWith('/groups/')
    ? location.pathname.split('/')[2]
    : null;

  const fetchGroups = async () => {
    try {
      setLoading(true);

      // Récupérer les groupes avec la structure hiérarchique (incluant les enfants)
      const result = await groupService.getGroups(true);

      // Gestion de la réponse hiérarchique
      let groupsData: SideMenuGroup[] = [];
      let childrenData: ChildWithGroups[] = [];

      if (result) {
        // Si on a une structure hiérarchique avec des enfants
        if (result.children && Array.isArray(result.children)) {
          const hierarchical = result as HierarchicalGroupsResponse;
          groupsData = hierarchical.groups || [];
          childrenData = hierarchical.children || [];
        }
        // Rétro-compatibilité : structure simple
        else if (result.data) {
          groupsData = Array.isArray(result.data) ? result.data : [];
        } else if (Array.isArray(result)) {
          groupsData = result;
        } else if (result.groups) {
          groupsData = Array.isArray(result.groups) ? result.groups : [];
        }
      }

      setGroups(groupsData);
      setChildren(childrenData);
      setError(null);

      // Notifier le parent des données chargées (notamment les enfants)
      if (onDataLoaded) {
        onDataLoaded({ children: childrenData });
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError(t('common:error') || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {/* No groups message */}
      {!loading && !error && groups.length === 0 && children.length === 0 && (
        <p className="text-gray-500 mb-4">{t('navigation:sidemenu.noGroups')}</p>
      )}

      {/* Groupes de l'utilisateur principal */}
      {!loading && groups.length > 0 && (
        <nav className="space-y-1">
          {groups.map((group) => (
            <GroupItem
              key={group.id}
              id={group.id}
              name={group.name}
              description={group.description}
              isActive={group.id === currentGroupId}
            />
          ))}
        </nav>
      )}
    </>
  );
};

export default GroupList;
