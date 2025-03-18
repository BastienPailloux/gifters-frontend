import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/forms/Button';
import { Group } from '../../types/groups';

interface GroupCardProps {
  group: Group;
  onViewGroup: (groupId: string) => void;
}

/**
 * Composant qui affiche les informations d'un groupe sous forme de carte
 * Utilisé principalement dans la page MyGroups
 */
const GroupCard: React.FC<GroupCardProps> = ({ group, onViewGroup }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-md px-3 transition-colors duration-200">
      <div>
        <p className="text-sm font-medium text-gray-900">{group.name}</p>
        {group.description && (
          <p className="text-sm text-gray-500 truncate max-w-xs">{group.description}</p>
        )}
        <p className="text-xs text-gray-400">
          {(() => {
            // Garantir qu'il y a au moins 1 membre (l'utilisateur lui-même)
            const memberCount = (group.members_count || group.member_count || 0) > 0
              ? (group.members_count || group.member_count || 1)
              : 1;

            return memberCount === 1
              ? t('groups.memberCount.singular', { count: 1 })
              : t('groups.memberCount.plural', { count: memberCount });
          })()}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewGroup(group.id)}
      >
        {t('common.view')}
      </Button>
    </div>
  );
};

export default GroupCard;
