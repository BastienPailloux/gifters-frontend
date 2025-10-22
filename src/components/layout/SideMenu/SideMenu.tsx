import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GroupList from './GroupList';
import ChildGroupSection from './ChildGroupSection';
import GroupCreationForm from '../../common/forms/GroupCreationForm';
import { SideMenuProps, ChildWithGroups } from '../../../types';

const SideMenu: React.FC<SideMenuProps> = () => {
  const { t } = useTranslation('navigation');
  const [groupListKey, setGroupListKey] = useState(0);
  const [children, setChildren] = useState<ChildWithGroups[]>([]);

  // Fonction pour rafraîchir la liste des groupes
  const refreshGroupList = useCallback(() => {
    setGroupListKey(prevKey => prevKey + 1);
  }, []);

  // Gestionnaire de création de groupe réussie
  const handleGroupCreated = useCallback(() => {
    refreshGroupList();
  }, [refreshGroupList]);

  // Gestionnaire appelé quand GroupList a chargé les données
  const handleDataLoaded = useCallback((data: { children: ChildWithGroups[] }) => {
    setChildren(data.children);
  }, []);

  // Configuration des écouteurs d'événements pour les changements de groupe
  useEffect(() => {
    const handleGroupChange = () => {
      refreshGroupList();
    };

    document.addEventListener('groupCreated', handleGroupChange);
    document.addEventListener('groupJoined', handleGroupChange);
    document.addEventListener('groupLeft', handleGroupChange);
    document.addEventListener('groupDeleted', handleGroupChange);
    document.addEventListener('groupUpdated', handleGroupChange);

    return () => {
      document.removeEventListener('groupCreated', handleGroupChange);
      document.removeEventListener('groupJoined', handleGroupChange);
      document.removeEventListener('groupLeft', handleGroupChange);
      document.removeEventListener('groupDeleted', handleGroupChange);
      document.removeEventListener('groupUpdated', handleGroupChange);
    };
  }, [refreshGroupList]);

  return (
    <div className="bg-white h-full shadow-md flex-shrink-0 border-r border-gray-200 w-full overflow-hidden">
      <div className="p-4 h-full overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('navigation:sidemenu.groups')}</h2>

        {/* Utilisation du composant GroupList */}
        <GroupList key={groupListKey} onDataLoaded={handleDataLoaded} />

        <div className="mt-6 space-y-2">
          {/* Utilisation du composant GroupCreationForm */}
          <GroupCreationForm
            className="mb-2"
            refetchOnCreate={true}
            onGroupCreated={handleGroupCreated}
          />

          <Link
            to="/invitations"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 w-full"
          >
            <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            {t('navigation:sidemenu.joinGroup')}
          </Link>
        </div>

        {/* Section des comptes managés */}
        {children.length > 0 && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('navigation:sidemenu.managedAccounts')}</h2>
            {children.map((child) => (
              <ChildGroupSection
                key={child.id}
                child={child}
                onGroupCreated={handleGroupCreated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideMenu;
