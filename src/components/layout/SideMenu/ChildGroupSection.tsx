import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GroupItem from './GroupItem';
import InlineGroupCreationInput from '../../common/forms/InlineGroupCreationInput';
import IconLinkButton from '../../common/forms/IconLinkButton';
import { ChildWithGroups } from '../../../types';

interface ChildGroupSectionProps {
  child: ChildWithGroups;
  onGroupCreated: () => void;
}

/**
 * Composant pour afficher les groupes d'un enfant managé dans le SideMenu
 * Reprend la même structure que la section "Mes Groupes"
 */
const ChildGroupSection: React.FC<ChildGroupSectionProps> = ({ child, onGroupCreated }) => {
  const { t } = useTranslation('navigation');
  const location = useLocation();

  // Obtenir l'ID du groupe actif à partir de l'URL
  const currentGroupId = location.pathname.startsWith('/groups/')
    ? location.pathname.split('/')[2]
    : null;

  // Gestionnaire de création de groupe réussie pour cet enfant
  const handleGroupCreated = useCallback(() => {
    onGroupCreated();
  }, [onGroupCreated]);

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-md hover:bg-primary-100 transition-colors duration-200">
      {/* Sous-titre avec le nom de l'enfant */}
      <div className="flex items-center mb-3 px-2">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-2">
          <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-primary-600">{child.name}</h3>
      </div>

      {/* Liste des groupes de l'enfant */}
      {child.groups && child.groups.length > 0 ? (
        <nav className="space-y-1 mb-4">
          {child.groups.map((group) => (
            <GroupItem
              key={group.id}
              id={group.id}
              name={group.name}
              description={group.description}
              isActive={group.id === currentGroupId}
            />
          ))}
        </nav>
      ) : (
        <p className="text-gray-500 mb-4 text-sm px-2">{t('sidemenu.noGroups')}</p>
      )}

      {/* Boutons d'action pour cet enfant - affichés côte à côte et alignés à droite */}
      <div className="flex items-center justify-center gap-2 px-2">
        {/* Bouton de création de groupe inline pour cet enfant */}
        <InlineGroupCreationInput
          onGroupCreated={handleGroupCreated}
          childId={child.id.toString()}
        />

        {/* Bouton pour rejoindre un groupe pour cet enfant */}
        <IconLinkButton
          to={`/invitations?child_id=${child.id}`}
          icon={
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          }
          ariaLabel={t('sidemenu.joinGroup')}
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default ChildGroupSection;
