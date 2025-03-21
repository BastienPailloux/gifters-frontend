import { User } from './auth';
import { ApiGiftIdea } from './gift-ideas';
import { Group } from './groups';

/**
 * Types pour la gestion du profil utilisateur
 */

/**
 * État du composant de page Profile
 */
export interface ProfilePageState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  hasAccess: boolean;
  sharedGroups: Group[];
  giftIdeas: ApiGiftIdea[];
  loadingGiftIdeas: boolean;
  sharedUserIds: string[];
}

/**
 * Données du formulaire de profil
 */
export interface ProfileFormData {
  name: string;
  email: string;
  birthday: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
  newsletter_subscription?: boolean;
}

/**
 * Props pour le composant Profile
 */
export interface ProfileProps {
  user: User;
  onSave?: (data: Partial<ProfileFormData>) => Promise<void>;
  loading?: boolean;
  error?: string;
  successMessage?: string;
  onDeleteAccount?: () => void;
  onLogout?: () => void;
  className?: string;
}

/**
 * Props pour le composant ProfileAvatar
 */
export interface ProfileAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onImageChange?: (file: File) => Promise<void>;
  className?: string;
}

/**
 * Props pour le composant ProfileSettings
 */
export interface ProfileSettingsProps {
  user: User;
  onSaveSettings: (settings: Partial<ProfileFormData>) => Promise<void>;
  loading?: boolean;
}

/**
 * Interface pour le composant ProfileForm
 */
export interface ProfileFormProps {
  user: User;
  onSubmit: (formData: ProfileFormData) => Promise<void>;
  onCancel: () => void;
}

/**
 * Interface pour le composant ProfileCard
 */
export interface ProfileCardProps {
  user: User;
  isCurrentUser: boolean;
  onEdit: () => void;
  hidePersonalInfo?: boolean;
}

/**
 * Interface pour le composant UserGiftIdeas
 */
export interface UserGiftIdeasProps {
  userName: string;
  giftIdeas: ApiGiftIdea[];
  isLoading: boolean;
}
