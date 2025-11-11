import React from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '../common/display/Avatar';
import { User } from '../../types/auth';
import { Child } from '../../types/children';

interface UserSelectorProps {
  users: Array<User | Child>;
  currentUserId: string | number;
  selectedUserIds: number[];
  onSelectionChange: (userIds: number[]) => void;
  title?: string;
  description?: string;
}

/**
 * Composant pour sélectionner des utilisateurs
 * Permet de sélectionner l'utilisateur actuel et/ou ses enfants managés
 */
const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  currentUserId,
  selectedUserIds,
  onSelectionChange,
  title,
  description
}) => {
  const { t } = useTranslation('invitation');

  const toggleUser = (userId: number) => {
    if (selectedUserIds.includes(userId)) {
      onSelectionChange(selectedUserIds.filter(id => id !== userId));
    } else {
      onSelectionChange([...selectedUserIds, userId]);
    }
  };

  const toggleAll = () => {
    const allUserIds = users.map(user => Number(user.id));

    if (selectedUserIds.length === allUserIds.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allUserIds);
    }
  };

  const allUserIds = users.map(user => Number(user.id));
  const allSelected = selectedUserIds.length === allUserIds.length && allUserIds.length > 0;

  const isCurrentUser = (userId: string | number) => {
    return Number(userId) === Number(currentUserId);
  };

  const getUserLabel = (user: User | Child) => {
    if (isCurrentUser(user.id)) {
      return t('common:you');
    }

    if ('account_type' in user && user.account_type === 'managed' && 'parent_id' in user && user.parent_id === Number(currentUserId)) {
      return t('common:managedAccount');
    }

    return null;
  };

    return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {title || t('invitation:selectWhoJoins')}
        </h3>
        {allUserIds.length > 1 && (
          <button
            type="button"
            onClick={toggleAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {allSelected ? t('common:deselectAll') : t('common:selectAll')}
          </button>
        )}
      </div>

      {description && (
        <p className="text-sm text-gray-600 mb-4">
          {description}
        </p>
      )}

      <div className="space-y-2">
        {users.map((user) => {
          const label = getUserLabel(user);

          return (
            <div
              key={user.id}
              onClick={() => toggleUser(Number(user.id))}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedUserIds.includes(Number(user.id))
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedUserIds.includes(Number(user.id))}
                onChange={() => toggleUser(Number(user.id))}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-4"
                onClick={(e) => e.stopPropagation()}
              />
              <Avatar name={user.name} size="md" />
              <div className="ml-4 flex-1">
                <p className="text-base font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">
                  {'email' in user && user.email ? user.email : null}
                </p>
              </div>
              {label && (
                <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                  {label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {selectedUserIds.length === 0 && (
        <p className="text-sm text-amber-600 mt-4">
          {t('invitation:pleaseSelectAtLeastOne')}
        </p>
      )}
    </div>
  );
};

export default UserSelector;
