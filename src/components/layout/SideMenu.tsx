import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { groupService } from '../../services/api';

// Interface pour le type Group
interface Group {
  id: string;
  name: string;
  description?: string;
}

const SideMenu: React.FC = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const result = await groupService.getGroups();

        // Gestion améliorée de la réponse basée sur la structure de l'API
        let groupsData: Group[] = [];

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
    <div className="bg-white h-full shadow-md flex-shrink-0 border-r border-gray-200 w-full overflow-hidden">
      <div className="p-4 h-full overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('sidemenu.groups')}</h2>

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
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <span className="truncate">{group.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-6 space-y-2">
          <Link
            to="/groups/new"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 w-full"
          >
            <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {t('sidemenu.createGroup')}
          </Link>

          <Link
            to="/invitations"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 w-full"
          >
            <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            {t('sidemenu.joinGroup')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
