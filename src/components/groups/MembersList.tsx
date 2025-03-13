import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MemberItem, { Member } from './MemberItem';
import { membershipService } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import Button from '../common/forms/Button';
import InvitationModal from './InvitationModal';

interface MembersListProps {
  groupId: string;
  isCurrentUserAdmin?: boolean;
}

const MembersList: React.FC<MembersListProps> = ({ groupId, isCurrentUserAdmin }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserMembership, setCurrentUserMembership] = useState<Member | null>(null);
  const [adminStatusDetermined, setAdminStatusDetermined] = useState<boolean>(isCurrentUserAdmin !== undefined);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Si le statut admin est déjà fourni par la prop, on le considère comme déterminé
    if (isCurrentUserAdmin !== undefined) {
      setAdminStatusDetermined(true);
    }
  }, [isCurrentUserAdmin]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!groupId) return;

      try {
        setLoading(true);
        const membersData = await membershipService.getGroupMembers(groupId);
        setMembers(membersData);

        // Trouver le membership de l'utilisateur actuel uniquement si le statut admin n'est pas déjà fourni
        if (isCurrentUserAdmin === undefined && user) {
          const userMembership = membersData.find(
            (member: Member) => member.user_id === user.id
          );
          setCurrentUserMembership(userMembership || null);
          setAdminStatusDetermined(true);
        }
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(t('groups.errorLoadingMembers'));
        // Même en cas d'erreur, on considère que le statut est déterminé
        setAdminStatusDetermined(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId, user, t, isCurrentUserAdmin]);

  const handleChangeRole = async (membershipId: string, newRole: 'member' | 'admin') => {
    try {
      await membershipService.updateMemberRole(groupId, membershipId, newRole);
      // Mettre à jour l'état local pour refléter le changement
      setMembers(prevMembers =>
        prevMembers.map(member =>
          member.id === membershipId
            ? { ...member, role: newRole }
            : member
        )
      );
    } catch (err) {
      console.error('Error updating member role:', err);
      setError(t('groups.errorUpdatingRole'));
    }
  };

  const handleRemoveMember = async (membershipId: string) => {
    if (window.confirm(t('groups.confirmRemoveMember'))) {
      try {
        await membershipService.removeMember(groupId, membershipId);
        // Mettre à jour l'état local pour refléter le changement
        setMembers(prevMembers =>
          prevMembers.filter(member => member.id !== membershipId)
        );
        // Si nous supprimons le membre sélectionné, réinitialiser la sélection
        if (selectedMemberId === membershipId) {
          setSelectedMemberId(null);
        }
      } catch (err) {
        console.error('Error removing member:', err);
        setError(t('groups.errorRemovingMember'));
      }
    }
  };

  const handleMemberClick = (memberId: string) => {
    setSelectedMemberId(prevId => prevId === memberId ? null : memberId);
  };

  const openInvitationModal = () => {
    setIsInvitationModalOpen(true);
  };

  const closeInvitationModal = () => {
    setIsInvitationModalOpen(false);
  };

  if (loading || !adminStatusDetermined) {
    return <div className="p-4 text-center">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  const isAdminDetermined = isCurrentUserAdmin !== undefined
    ? isCurrentUserAdmin
    : currentUserMembership?.role === 'admin';

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('groups.membersList')}</h2>
        {isAdminDetermined && (
          <Button
            variant="outline"
            onClick={openInvitationModal}
            className="flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('groups.addNewMember')}
          </Button>
        )}
      </div>

      {members.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded-md">
          {t('groups.noMembers')}
        </div>
      ) : (
        <div>
          {members.map(member => (
            <MemberItem
              key={member.id}
              member={member}
              currentUserIsAdmin={isAdminDetermined}
              onChangeRole={isAdminDetermined ? handleChangeRole : undefined}
              onRemove={isAdminDetermined ? handleRemoveMember : undefined}
              onClick={() => handleMemberClick(member.id)}
              isActive={selectedMemberId === member.id}
            />
          ))}
        </div>
      )}

      <InvitationModal
        groupId={groupId}
        isOpen={isInvitationModalOpen}
        onClose={closeInvitationModal}
      />
    </div>
  );
};

export default MembersList;
