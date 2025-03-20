import { User } from './auth';
import { ApiGiftIdea } from './gift-ideas';

/**
 * Interface de données du formulaire de profil
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
