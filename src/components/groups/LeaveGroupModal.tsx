import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/modals/Modal';
import Button from '../common/forms/Button';
import UserSelector from '../profile/UserSelector';
import { groupService } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { Child } from '../../types/children';
import { Member } from '../../types/groups';

interface LeaveGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupMembers: Member[];
}

/**
 * Modal pour quitter un groupe
 * Permet de sélectionner quel(s) utilisateur(s) (parent et/ou enfants) doivent quitter le groupe
 */
const LeaveGroupModal: React.FC<LeaveGroupModalProps> = ({
  isOpen,
  onClose,
  groupId,
  groupMembers
}) => {
  const { t } = useTranslation(['groups', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [childrenInGroup, setChildrenInGroup] = useState<Child[]>([]);

  useEffect(() => {
    if (!user || !isOpen) return;

    // Filtrer les enfants qui sont membres du groupe
    // Ce sont des comptes managés dont le parent_id correspond à l'utilisateur actuel
    const childMembers = groupMembers
      .filter(member => {
        return member.account_type === 'managed' && member.parent_id === Number(user.id);
      })
      .map(member => ({
        id: String(member.id),
        name: member.name,
        email: member.email,
        account_type: 'managed' as const,
        parent_id: Number(user.id),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

    setChildrenInGroup(childMembers);

    // Réinitialiser la sélection
    setSelectedUserIds([]);
    setError(null);
  }, [user, groupMembers, isOpen]);

  const handleLeaveGroup = async () => {
    if (selectedUserIds.length === 0) {
      setError(t('groups:pleaseSelectAtLeastOne'));
      return;
    }

    if (!user) return;

    setIsLeaving(true);
    setError(null);

      try {
      // Faire quitter chaque utilisateur sélectionné
      for (const userId of selectedUserIds) {
        if (userId === Number(user.id)) {
          // L'utilisateur actuel quitte
          await groupService.leaveGroup(groupId);
        } else {
          // Un enfant quitte
          await groupService.leaveGroup(groupId, String(userId));
        }
      }

      // Vérifier si l'utilisateur a encore accès au groupe après les départs
      const userHasLeft = selectedUserIds.includes(Number(user.id));

      // Calculer les enfants restants après les départs
      const remainingChildren = childrenInGroup.filter(
        child => !selectedUserIds.includes(Number(child.id))
      );

      // Si l'utilisateur a quitté OU s'il n'a plus d'enfants dans le groupe (et n'était pas membre lui-même)
      // alors rediriger vers la page des groupes
      if (userHasLeft || (!isCurrentUserMember && remainingChildren.length === 0)) {
        navigate('/groups');
      } else {
        // Sinon, juste fermer le modal et rafraîchir la page
        onClose();
        window.location.reload();
      }
    } catch (err) {
      console.error('Error leaving group:', err);
      const errorResponse = err as { response?: { data?: { error?: string } } };
      if (errorResponse.response?.data?.error?.includes('last admin')) {
        setError(t('groups:cannotLeaveLastAdmin'));
      } else {
        setError(t('groups:errorLeavingGroup'));
      }
    } finally {
      setIsLeaving(false);
    }
  };

  const isCurrentUserMember = groupMembers.some(
    member => user && member.id === user.id
  );

  const hasEligibleUsers = isCurrentUserMember || childrenInGroup.length > 0;

  if (!user || !hasEligibleUsers) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('groups:leaveGroup')}
      size="lg"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          {t('groups:selectWhoLeaves')}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <p className="text-sm text-amber-800">
            {t('groups:leaveGroupWarning')}
          </p>
        </div>

        {isCurrentUserMember && (
          <UserSelector
            currentUser={user}
            children={childrenInGroup}
            selectedUserIds={selectedUserIds}
            onSelectionChange={setSelectedUserIds}
          />
        )}

        {!isCurrentUserMember && childrenInGroup.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              {t('groups:selectChildren')}
            </h3>
            {childrenInGroup.map((child) => (
              <div
                key={child.id}
                onClick={() => {
                  const childId = Number(child.id);
                  if (selectedUserIds.includes(childId)) {
                    setSelectedUserIds(selectedUserIds.filter(id => id !== childId));
                  } else {
                    setSelectedUserIds([...selectedUserIds, childId]);
                  }
                }}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedUserIds.includes(Number(child.id))
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(Number(child.id))}
                  onChange={() => {}}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-4"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-900">{child.name}</p>
                  <p className="text-sm text-gray-500">{t('common:managedAccount')}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLeaving}
          >
            {t('common:cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleLeaveGroup}
            disabled={isLeaving || selectedUserIds.length === 0}
          >
            {isLeaving ? t('common:leaving') : t('common:leave')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveGroupModal;
