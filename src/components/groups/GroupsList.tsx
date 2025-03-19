import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../common/display/Card';
import GroupCard from './GroupCard';
import { GroupsListProps } from '../../types/groups';

/**
 * Composant qui affiche une liste de groupes sous forme de carte
 * Encapsule plusieurs GroupCard dans une seule Card
 */
const GroupsList: React.FC<GroupsListProps> = ({
  groups,
  onViewGroup,
  isLoading = false,
  emptyMessage,
  className = ''
}) => {
  const { t } = useTranslation();
  const defaultEmptyMessage = t('groups.noGroups');

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="flex justify-center items-center h-40 p-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="p-4 divide-y divide-gray-200">
        {groups.length === 0 ? (
          <p className="text-gray-500 p-4 text-center">
            {emptyMessage || defaultEmptyMessage}
          </p>
        ) : (
          groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onViewGroup={onViewGroup}
            />
          ))
        )}
      </div>
    </Card>
  );
};

export default GroupsList;
