import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';
import { User } from '../types/auth';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileForm from '../components/profile/ProfileForm';
import PageHeader from '../components/common/layout/PageHeader';
import { ApiGiftIdea } from '../types/gift-ideas';
import { Group } from '../types/groups';
import UserGiftIdeas from '../components/profile/UserGiftIdeas';

interface ProfilePageState {
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

interface ProfileFormData {
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

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [state, setState] = useState<ProfilePageState>({
    user: null,
    loading: true,
    error: null,
    isEditing: false,
    hasAccess: true,
    sharedGroups: [],
    giftIdeas: [],
    loadingGiftIdeas: false,
    sharedUserIds: []
  });

  // Récupérer la liste des IDs utilisateurs partagés au chargement du composant
  useEffect(() => {
    const fetchSharedUsers = async () => {
      try {
        const response = await userService.getSharedUsers();
        // Convertir tous les IDs en chaînes de caractères
        const stringUserIds = response.user_ids?.map((id: number | string) => id.toString()) || [];
        setState(prev => ({
          ...prev,
          sharedUserIds: stringUserIds
        }));
      } catch (err) {
        console.error('Error fetching shared users:', err);
      }
    };

    fetchSharedUsers();
  }, []);

  // Vérifier l'accès et charger les données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Cas du profil courant
        if (!id || id === currentUser?.id.toString()) {
          const userData = await userService.getCurrentUserProfile();
          setState(prev => ({
            ...prev,
            user: userData.user,
            loading: false,
            hasAccess: true
          }));
          return;
        }

        // Cas d'un autre utilisateur - vérifier si l'accès est autorisé
        const hasAccess = state.sharedUserIds.includes(id);

        if (!hasAccess) {
          setState(prev => ({
            ...prev,
            loading: false,
            hasAccess: false,
            error: t('profile.noAccess')
          }));
          return;
        }

        // Si accès autorisé, charger les données
        const userData = await userService.getUserById(id);
        setState(prev => ({
          ...prev,
          user: userData.user,
          loading: false,
          hasAccess: true
        }));
      } catch (err) {
        if (err instanceof Error) {
          setState(prev => ({
            ...prev,
            error: err.message,
            loading: false
          }));
        } else {
          setState(prev => ({
            ...prev,
            error: t('common.error'),
            loading: false
          }));
        }
      }
    };

    fetchUserData();
  }, [id, t, currentUser, state.sharedUserIds]);

  // Charger les idées de cadeaux si on consulte le profil d'un autre utilisateur
  useEffect(() => {
    const fetchGiftIdeas = async () => {
      if (!id || !state.hasAccess || id === currentUser?.id.toString() || !state.user) {
        return;
      }

      try {
        setState(prev => ({ ...prev, loadingGiftIdeas: true }));
        const response = await userService.getUserGiftIdeas(id, ['proposed', 'buying']);

        setState(prev => ({
          ...prev,
          giftIdeas: response.giftIdeas || [],
          loadingGiftIdeas: false
        }));
      } catch (err) {
        console.error('Error fetching gift ideas:', err);
        setState(prev => ({ ...prev, loadingGiftIdeas: false }));
      }
    };

    fetchGiftIdeas();
  }, [id, state.user, state.hasAccess, currentUser]);

  const handleEdit = () => {
    setState(prev => ({ ...prev, isEditing: true }));
  };

  const handleCancel = () => {
    setState(prev => ({ ...prev, isEditing: false }));
  };

  const handleSubmit = async (formData: ProfileFormData) => {
    try {
      await userService.updateProfile(formData);
      // Après la mise à jour, récupérer les nouvelles données utilisateur
      const userData = await userService.getCurrentUserProfile();
      setState(prev => ({
        ...prev,
        user: userData.user,
        isEditing: false
      }));
    } catch (err) {
      if (err instanceof Error) {
        setState(prev => ({
          ...prev,
          error: err.message
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: t('common.error')
        }));
      }
    }
  };

  if (state.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (state.error && !state.hasAccess) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-600 mb-4">{state.error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {t('common.back')}
        </button>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{state.error}</div>
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">{t('profile.userNotFound')}</div>
      </div>
    );
  }

  const isCurrentUser = !id || id === currentUser?.id.toString();

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={isCurrentUser ? t('profile.yourProfile') : state.user.name}
        description={isCurrentUser ? t('profile.manageYourInfo') : t('profile.viewOtherProfile')}
        showBackButton
        onBackClick={() => window.history.back()}
      />
      {state.isEditing && isCurrentUser ? (
        <ProfileForm
          user={state.user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <div>
          {isCurrentUser ? (
            <ProfileCard
              user={state.user}
              isCurrentUser={isCurrentUser}
              onEdit={handleEdit}
              hidePersonalInfo={false}
            />
          ) : (
            <UserGiftIdeas
              userName={state.user.name}
              giftIdeas={state.giftIdeas}
              isLoading={state.loadingGiftIdeas}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
