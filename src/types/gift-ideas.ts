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
 * Props pour le composant de sélection de destinataires
 */
export interface RecipientSelectorProps {
  recipients: Recipient[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  className?: string;
  maxDisplayed?: number;
  maxSelection?: number;
  label?: string;
  errorMessage?: string;
}

/**
 * Métadonnées extraites d'une URL pour une idée cadeau
 */
export interface GiftMetadata {
  title?: string;
  description?: string;
  price?: number;
  image_url?: string;
  imageUrl?: string;
  link?: string;
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

/**
 * Props pour le composant de saisie manuelle d'une idée cadeau
 */
export interface GiftIdeaManualInputProps {
  giftData: GiftMetadata;
  onChange: (field: keyof GiftMetadata, value: string | number) => void;
}

/**
 * Props pour le composant de récupération d'une idée cadeau à partir d'une URL
 */
export interface GiftIdeaFromUrlProps {
  onMetadataFetched: (metadata: GiftMetadata) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  giftData: GiftMetadata;
  onChange: (field: keyof GiftMetadata, value: string | number) => void;
}

/**
 * Représente un cadeau en cours d'achat dans le dashboard
 */
export interface BuyingGift {
  id: string;
  title: string;
  for_user_name: string;
  recipients?: Array<{id: string, name: string}>;
  group_name: string;
  status: GiftStatus;
}

/**
 * Props pour le composant BuyingGiftItem qui affiche un cadeau en cours d'achat
 */
export interface BuyingGiftItemProps {
  gift: BuyingGift;
  onMarkAsBought: (giftId: string) => void;
  isProcessing?: boolean;
}

/**
 * Props pour le composant BuyingGiftsList qui affiche la liste des cadeaux en cours d'achat
 */
export interface BuyingGiftsListProps {
  maxGifts?: number;
}

/**
 * Props pour le composant de modal de célébration
 */
export interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftTitle?: string;
  recipientName?: string;
}

/**
 * Représente une idée cadeau telle que renvoyée par l'API pour l'affichage dans le contexte d'un groupe
 */
export interface ApiGiftIdea {
  id: number | string;
  title: string;
  status: string;
  forUser?: { id: number | string; name: string } | string;
  forUserName?: string;
  recipients?: Array<{ id: number | string; name: string }>;
  price?: number;
  for_user_name?: string;
  groupName?: string;
  group?: { id: number | string; name: string } | string;
}

/**
 * Représente la réponse API pour la liste des idées cadeaux en cours d'achat
 */
export interface ApiGiftIdeasResponse {
  giftIdeas: ApiGiftIdea[];
}

/**
 * Représente une idée de cadeau avec des informations additionnelles
 * sur les destinataires et le groupe, utilisée dans la page de détail
 */
export interface ExtendedGiftIdea extends GiftIdea {
  recipients: Array<{
    id: string;
    name: string;
  }>;
  group_name?: string;
}
