import { ReactNode } from 'react';
import { User } from './auth';

/**
 * Props pour le composant MainContainer
 */
export interface MainContainerProps {
  children: ReactNode;
}

/**
 * Représentation simplifiée d'un groupe dans le menu latéral
 */
export interface SideMenuGroup {
  id: string;
  name: string;
  description?: string;
}

/**
 * Représentation d'un enfant avec ses groupes
 */
export interface ChildWithGroups {
  id: string | number;
  name: string;
  account_type: string;
  groups: SideMenuGroup[];
}

/**
 * Réponse hiérarchique des groupes avec les enfants managés
 */
export interface HierarchicalGroupsResponse {
  id: string | number;
  name: string;
  account_type: string;
  groups: SideMenuGroup[];
  children: ChildWithGroups[];
}

/**
 * Props pour le composant GroupItem dans le menu latéral
 */
export interface SideMenuGroupItemProps {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

/**
 * Props pour le composant GroupList dans le menu latéral
 */
export interface GroupListProps {
  onGroupCreated?: () => void;
  onDataLoaded?: (data: { children: ChildWithGroups[] }) => void;
}

/**
 * Props pour le composant SideMenu
 */
export interface SideMenuProps {
  user?: User | null;
}

/**
 * Props pour le composant Header
 */
export interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

/**
 * Props pour le composant Layout
 */
export interface LayoutProps {
  children: ReactNode;
  forceSideMenu?: boolean;
}

/**
 * Props pour le composant Footer
 */
export interface FooterProps {
  showFullFooter?: boolean;
}
