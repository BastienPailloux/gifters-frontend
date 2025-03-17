import { User } from './auth';
import { ReactNode } from 'react';

/**
 * Props pour le composant DashboardSummaryCard
 */
export interface DashboardSummaryCardProps {
  user: User | null;
}

/**
 * Propriétés pour une action rapide sur le tableau de bord
 */
export interface QuickActionProps {
  title: string;
  description: string;
  actionLabel: string;
  route: string;
  icon?: ReactNode;
}

/**
 * Props pour le composant de liste d'actions rapides
 */
export interface QuickActionsListProps {
  className?: string;
}
