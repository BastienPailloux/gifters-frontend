import { User } from './auth';
import { Group } from './groups';

/**
 * Représente un événement
 */
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  group_id: string;
  created_by_id: string;
  created_at: string;
  updated_at: string;

  // Relations
  created_by?: User;
  group?: Group;
}

/**
 * Représente un événement à venir avec des informations formatées
 */
export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  formattedDate: string;
  daysUntil: number;
  group?: {
    id: string;
    name: string;
  };
}

/**
 * Props pour le composant UpcomingEventItem
 */
export interface UpcomingEventItemProps {
  event: UpcomingEvent;
  onClick?: (id: string) => void;
}

/**
 * Props pour le composant UpcomingEventsList
 */
export interface UpcomingEventsListProps {
  maxEvents?: number;
  className?: string;
}

/**
 * Données de création d'événement
 */
export interface EventCreationData {
  title: string;
  description?: string;
  date: string;
  location?: string;
  group_id: string;
}

/**
 * Réponse API pour la liste des événements
 */
export interface EventsApiResponse {
  events: Event[];
  total?: number;
  page?: number;
  perPage?: number;
}

/**
 * Réponse API pour un seul événement
 */
export interface SingleEventApiResponse {
  event: Event;
}
