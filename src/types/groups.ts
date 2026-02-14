import { User } from './auth';
import { ReactNode } from 'react';
import { GiftStatus } from './ui';

/**
 * Permissions de l'utilisateur sur un groupe
 */
export interface GroupPermissions {
  can_administer: boolean;
  is_direct_admin: boolean;
  is_member: boolean;
}

/**
 * Représente un groupe d'utilisateurs
 */
export interface Group {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by_id?: string;
  members_count?: number;
  member_count?: number;
  created_by?: User;
  isAdmin?: boolean;
  permissions?: GroupPermissions;
  childMemberName?: string; // Nom de l'enfant membre (pour les groupes des enfants)
}

/**
 * Représente un membre d'un groupe
 */
export interface Member {
  id: string;
  membershipId: string; // ID du membership pour les actions REST (update, delete)
  name: string;
  email: string;
  role: 'member' | 'admin';
  accountType?: 'standard' | 'managed';
  parentId?: number;
  avatar?: string;
  isAdmin?: boolean;
  joinedAt?: string;
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
  currentUserId?: string;
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
 * Props pour le composant de formulaire de création de groupe
 */
export interface GroupCreationFormProps {
  /** Callback appelée après la création réussie d'un groupe */
  onGroupCreated?: () => void;
  /** Style personnalisé pour le conteneur */
  className?: string;
  /** Texte du bouton pour créer un groupe */
  buttonText?: string;
  /** Afficher uniquement l'input (sans bouton) */
  inputOnly?: boolean;
  /** Indique si le composant doit refetch les données après création (au lieu de recharger la page) */
  refetchOnCreate?: boolean;
  /** ID de l'enfant pour lequel créer le groupe (optionnel, si non fourni, le groupe est créé pour l'utilisateur courant) */
  childId?: string;
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

/**
 * Props pour le composant InvitationModal
 */
export interface InvitationModalProps {
  groupId: string;
  groupName: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Props pour le composant GroupFormModal
 */
export interface GroupFormModalProps {
  /** Mode du formulaire: création ou édition */
  mode: 'create' | 'edit';
  /** Données du groupe à éditer (optionnel en mode création) */
  group: {
    id: string;
    name: string;
    description?: string;
  };
  /** Indique si le modal est ouvert */
  isOpen: boolean;
  /** Fonction appelée à la fermeture du modal */
  onClose: () => void;
  /** Fonction appelée après une création/modification réussie */
  onSuccess: () => void;
}

/**
 * @deprecated Utiliser GroupFormModalProps à la place
 * Props pour le composant GroupEditModal
 */
export interface GroupEditModalProps {
  group: {
    id: string;
    name: string;
    description?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

/**
 * Props pour le composant GiftIdeaCreationModal
 */
export interface GiftIdeaCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupMembers: Member[];
  onSuccess: () => void;
}

/**
 * Props pour le composant GroupItemsList
 */
export interface GroupItemsListProps<T> {
  title: string;
  items: T[] | undefined;
  emptyMessage: string;
  actionLabel: string;
  onAction: () => void;
  renderItem: (item: T) => ReactNode;
  className?: string;
}

/**
 * Représente une idée cadeau simplifiée dans le contexte d'un groupe
 */
export interface GroupGiftIdea {
  id: string;
  title: string;
  for_user_name: string;
  recipients?: Array<{id: string, name: string}>;
  price?: number;
  status: GiftStatus;
}

/**
 * Props pour le composant GiftIdeaItem dans le contexte des groupes
 */
export interface GroupGiftIdeaItemProps {
  gift: GroupGiftIdea;
  onViewGift: (giftId: string) => void;
}

/**
 * Représente les données détaillées d'un groupe
 */
export interface GroupDetailsData {
  id: string;
  name: string;
  description?: string;
  members_count?: number;
  permissions?: GroupPermissions;
  members?: Member[];
  events?: GroupEvent[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Représente un événement dans le contexte d'un groupe
 */
export interface GroupEvent {
  id: string;
  title: string;
  date: string;
}

/**
 * Props pour le composant GroupCard
 */
export interface GroupCardProps {
  group: Group;
  onViewGroup: (groupId: string) => void;
}

/**
 * Props pour le composant AddGroupCard
 */
export interface AddGroupCardProps {
  onClick: () => void;
  className?: string;
}

/**
 * Props pour le composant GroupsList
 */
export interface GroupsListProps {
  groups: Group[];
  onViewGroup: (groupId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}
