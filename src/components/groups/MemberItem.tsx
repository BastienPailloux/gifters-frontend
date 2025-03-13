import React from 'react';
import { useTranslation } from 'react-i18next';
import ColorTag from '../common/display/ColorTag';
import ClickableCard from '../common/display/ClickableCard';
import FlatButton from '../common/forms/FlatButton';

export interface Member {
  id: string;
  user_id: string;
  group_id: string;
  role: 'member' | 'admin';
  user_name: string;
  user_email: string;
}

interface MemberItemProps {
  member: Member;
  currentUserIsAdmin: boolean;
  onChangeRole?: (memberId: string, newRole: 'member' | 'admin') => void;
  onRemove?: (memberId: string) => void;
  onClick?: () => void;
  isActive?: boolean;
}

const MemberItem: React.FC<MemberItemProps> = ({
  member,
  currentUserIsAdmin,
  onChangeRole,
  onRemove,
  onClick,
  isActive = false
}) => {
  const { t } = useTranslation();

  const handleChangeRole = () => {
    if (onChangeRole) {
      onChangeRole(member.id, member.role === 'admin' ? 'member' : 'admin');
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(member.id);
    }
  };

  return (
    <ClickableCard
      onClick={onClick}
      isActive={isActive}
      className="mb-2"
      bodyClassName="p-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-full text-lg font-semibold text-indigo-600">
            {member.user_name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{member.user_name}</div>
            <div className="text-sm text-gray-500">{member.user_email}</div>
          </div>
        </div>

        <div className="flex items-center">
          <ColorTag
            text={member.role === 'admin' ? t('groups.roleAdmin') : t('groups.roleMember')}
            color={member.role === 'admin' ? 'purple' : 'blue'}
          />

          {currentUserIsAdmin && (
            <div className="flex ml-4" onClick={(e) => e.stopPropagation()}>
              {onChangeRole && (
                <FlatButton
                  onClick={handleChangeRole}
                  variant="primary"
                  size="small"
                  className="mr-3"
                  aria-label={member.role === 'admin' ? t('groups.makeUserMember') : t('groups.makeUserAdmin')}
                >
                  {member.role === 'admin' ? t('groups.downgradeRole') : t('groups.upgradeRole')}
                </FlatButton>
              )}

              {onRemove && (
                <FlatButton
                  onClick={handleRemove}
                  variant="danger"
                  size="small"
                  aria-label={t('groups.removeMember')}
                >
                  {t('groups.remove')}
                </FlatButton>
              )}
            </div>
          )}
        </div>
      </div>
    </ClickableCard>
  );
};

export default MemberItem;
