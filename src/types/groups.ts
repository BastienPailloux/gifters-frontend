import { User } from './auth';

/**
 * Représente un groupe d'utilisateurs
 */
export interface Group {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  member_count?: number;
  created_by?: User;
  isAdmin?: boolean;
}

/**
 * Représente un membre d'un groupe
 */
export interface Member {
  id: string;
  user_id: string;
  group_id: string;
  role: 'member' | 'admin';
  user_name: string;
  user_email: string;
  name?: string;
  email?: string;
  avatar?: string;
  isAdmin?: boolean;
  membership_id?: string;
  joined_at?: string;
}

/**
 * Props pour le composant GroupItem
 */
export interface GroupItemProps {
  group: Group;
  onClick?: (id: string) => void;
  selected?: boolean;
}

/**
 * Props pour le composant MemberItem
 */
export interface MemberItemProps {
  member: Member;
  currentUserIsAdmin: boolean;
  onChangeRole?: (memberId: string, newRole: 'member' | 'admin') => void;
  onRemove?: (memberId: string) => void;
  onClick?: () => void;
  isActive?: boolean;
}

/**
 * Props pour le composant MembersList
 */
export interface MembersListProps {
  groupId: string;
  isCurrentUserAdmin?: boolean;
  groupName: string;
  className?: string;
}

/**
 * Données de création de groupe
 */
export interface GroupCreationData {
  name: string;
  description?: string;
  members?: string[];
}

/**
 * Réponse API pour la liste des groupes
 */
export interface GroupsApiResponse {
  groups: Group[];
  total?: number;
  page?: number;
  perPage?: number;
}

/**
 * Réponse API pour un seul groupe
 */
export interface SingleGroupApiResponse {
  group: Group;
  members?: Member[];
}

/**
 * Données pour l'invitation d'un membre
 */
export interface InvitationData {
  email: string;
  group_id: string;
  message?: string;
}
