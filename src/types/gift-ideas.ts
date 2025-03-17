import { User } from './auth';
import { GiftStatus } from './ui';

/**
 * Représente une idée de cadeau avec toutes ses propriétés
 */
export interface GiftIdea {
  id: string;
  title: string;
  description?: string;
  price?: number;
  link?: string;
  image_url?: string;
  status: GiftStatus;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  recipient_id?: string;
  buyer_id?: string;
  group_id: string;
  recipient?: Recipient;
  created_by?: User;
  buyer?: User;
}

/**
 * Représente un destinataire d'une idée cadeau
 */
export interface Recipient {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

/**
 * Métadonnées extraites d'une URL pour une idée cadeau
 */
export interface GiftMetadata {
  title?: string;
  description?: string;
  price?: number;
  image_url?: string;
}

/**
 * Props pour le composant GiftIdeaItem
 */
export interface GiftIdeaItemProps {
  giftIdea: GiftIdea;
  onClick?: (id: string) => void;
  onMarkAsBuying?: (id: string) => void;
  onMarkAsBought?: (id: string) => void;
  canEdit?: boolean;
}

/**
 * Props pour le composant détaillé d'une idée cadeau
 */
export interface GiftIdeaDetailProps {
  giftId: string;
}

/**
 * Représente la réponse API pour les idées cadeaux
 */
export interface GiftIdeaApiResponse {
  giftIdeas: GiftIdea[];
  total?: number;
  page?: number;
  perPage?: number;
}

/**
 * Représente la réponse API pour une seule idée cadeau
 */
export interface SingleGiftIdeaApiResponse {
  giftIdea: GiftIdea;
}

/**
 * Props pour le composant de carte détaillée d'une idée cadeau
 */
export interface GiftIdeaDetailCardProps {
  giftIdea: GiftIdea & {
    recipients: Array<{
      id: string;
      name: string;
    }>;
    group_name?: string;
  };
  currentUser: User | null;
  onMarkAsBuying: () => void;
  onMarkAsBought: () => void;
  formatPrice: (price?: number) => string;
}
