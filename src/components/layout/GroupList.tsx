import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { groupService } from '../../services/api';
import GroupItem from './GroupItem';
import { SideMenuGroup, GroupListProps } from '../../types';

const GroupList: React.FC<GroupListProps> = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [groups, setGroups] = useState<SideMenuGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtenir l'ID du groupe actif à partir de l'URL
  const currentGroupId = location.pathname.startsWith('/groups/')
    ? location.pathname.split('/')[2]
    : null;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);

        const result = await groupService.getGroups();

        // Gestion améliorée de la réponse basée sur la structure de l'API
        let groupsData: SideMenuGroup[] = [];

        if (result && result.data) {
          // Si les données sont dans result.data
          groupsData = Array.isArray(result.data) ? result.data : [];
        } else if (result && Array.isArray(result)) {
          // Si le résultat est directement un tableau
          groupsData = result;
        } else if (result && result.groups) {
          // Si les données sont dans result.groups
          groupsData = Array.isArray(result.groups) ? result.groups : [];
        }

        setGroups(groupsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError(t('common.error') || 'Failed to load groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [t]);

  return (
    <div>
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

      {/* Group list */}
      {!loading && !error && groups.length === 0 && (
        <p className="text-gray-500 mb-4">{t('sidemenu.noGroups')}</p>
      )}

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
    </div>
  );
};

export default GroupList;
