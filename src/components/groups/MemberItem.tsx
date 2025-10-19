import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ColorTag from '../common/display/ColorTag';
import ClickableCard from '../common/display/ClickableCard';
import FlatButton from '../common/forms/FlatButton';
import Avatar from '../common/display/Avatar';
import { MemberItemProps } from '../../types';

const MemberItem: React.FC<MemberItemProps> = ({
  member,
  currentUserIsAdmin,
  onChangeRole,
  onRemove,
  onClick,
  isActive = false
}) => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();

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

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // Naviguer vers le profil du membre
    navigate(`/profile/${member.user_id}`);
  };

  return (
    <ClickableCard
      onClick={handleClick}
      isActive={isActive}
      className="mb-2"
      bodyClassName="p-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar
            name={member.user_name}
            size="md"
            variant={member.role === 'admin' ? 'primary' : 'secondary'}
          />
          <div className="ml-3">
            <div className="font-medium text-gray-900">{member.user_name}</div>
            <div className="text-sm text-gray-500">{member.user_email}</div>
          </div>
        </div>

        <div className="flex items-center">
          <ColorTag
            text={member.role === 'admin' ? t('groups:roleAdmin') : t('groups:roleMember')}
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
                  aria-label={member.role === 'admin' ? t('groups:makeUserMember') : t('groups:makeUserAdmin')}
                >
                  {member.role === 'admin' ? t('groups:downgradeRole') : t('groups:upgradeRole')}
                </FlatButton>
              )}

              {onRemove && (
                <FlatButton
                  onClick={handleRemove}
                  variant="danger"
                  size="small"
                  aria-label={t('groups:removeMember')}
                >
                  {t('groups:remove')}
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
