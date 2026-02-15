import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { invitationService, groupService, childrenService } from '../../services/api';
import Button from '../../components/common/forms/Button';
import useAuth from '../../hooks/useAuth';
import { SEO } from '../../components/common/seo';
import UserSelector from '../../components/profile/UserSelector';
import { Child } from '../../types/children';

/**
 * Page pour rejoindre un groupe via une invitation
 * Gère les différents cas :
 * - Utilisateur déjà connecté
 * - Utilisateur non connecté mais qui a un compte
 * - Utilisateur sans compte
 */
const InvitationJoin: React.FC = () => {
  const { t } = useTranslation('invitation');
  const [searchParams] = useSearchParams();
  const { token: tokenParam } = useParams<{ token?: string }>();
  const groupId = searchParams.get('group');
  const token = searchParams.get('token') || tokenParam;
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  const [groupName, setGroupName] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'select-users'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isAccepting, setIsAccepting] = useState(false);
  const [invitationGroupId, setInvitationGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId && !token) {
        setStatus('error');
        setErrorMessage(t('invitation:missingParameters'));
        return;
      }

      try {
        // Si nous avons un token, récupérer les informations de l'invitation
        if (token) {
          const invitation = await invitationService.getInvitation(token);
          if (invitation && invitation.group) {
            setGroupName(invitation.group.name);
            setInvitationGroupId(invitation.group.id);

            // Si l'utilisateur est connecté, charger les enfants et montrer la sélection
            if (isAuthenticated && !isLoading && user) {
              try {
                // Récupérer les enfants managés
                const childrenData = await childrenService.getChildren();
                setChildren(childrenData.children || []);

                // Par défaut, sélectionner l'utilisateur actuel
                setSelectedUserIds([Number(user.id)]);

                // Passer au statut de sélection des utilisateurs
                setStatus('select-users');
              } catch (childrenError) {
                console.error('Error fetching children:', childrenError);
                // Continuer même si on ne peut pas récupérer les enfants
                setChildren([]);
                setSelectedUserIds([Number(user.id)]);
                setStatus('select-users');
              }
            } else {
              // L'utilisateur n'est pas connecté, afficher le message de connexion
              setStatus('success');
            }
          }
        }
        // Si nous avons l'ID du groupe, récupérer les informations du groupe
        else if (groupId) {
          const group = await groupService.getGroup(groupId);
          if (group) {
            setGroupName(group.name || group.data?.name);
            setStatus('success');
          }
        }
      } catch (fetchError) {
        console.error('Error fetching group details:', fetchError);
        setStatus('error');
        setErrorMessage(t('invitation:errorFetchingDetails'));
      }
    };

    // Attendre que le statut d'authentification soit déterminé
    if (!isLoading) {
      fetchGroupDetails();
    }
  }, [groupId, token, isAuthenticated, isLoading, user, t]);

  const handleAcceptInvitation = async () => {
    if (!token || selectedUserIds.length === 0) return;

    try {
      setIsAccepting(true);
      const response = await invitationService.acceptInvitation(token, selectedUserIds);

      // Afficher un message de succès ou rediriger si déjà membre
      if (response.success) {
        const groupId = response.group?.id ?? invitationGroupId;
        if (response.already_member && groupId) {
          // Déjà membre : redirection immédiate vers le groupe
          navigate(`/groups/${groupId}`);
        } else {
          setStatus('success');
          // Rediriger vers la page du groupe après 2 secondes
          setTimeout(() => {
            if (groupId) {
              navigate(`/groups/${groupId}`);
            }
          }, 2000);
        }
      } else {
        setStatus('error');
        setErrorMessage(response.message || t('invitation:errorAccepting'));
      }
    } catch (acceptError) {
      console.error('Error accepting invitation:', acceptError);
      setStatus('error');
      const errorMessage = acceptError instanceof Error
        ? acceptError.message
        : t('invitation:errorAccepting');
      setErrorMessage(errorMessage);
    } finally {
      setIsAccepting(false);
    }
  };

  const getInvitationRedirectUrl = () => {
    const params = new URLSearchParams();
    if (token) params.set('token', token);
    if (groupId) params.set('group', groupId);
    return `/invitation/join?${params.toString()}`;
  };

  const handleLogin = () => {
    navigate(`/login?redirect=${encodeURIComponent(getInvitationRedirectUrl())}`);
  };

  const handleRegister = () => {
    navigate(`/register?redirect=${encodeURIComponent(getInvitationRedirectUrl())}`);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <SEO translationKey="invitation" />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-gray-600">{t('common:loading')}</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <SEO translationKey="invitation" />
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('invitation:errorTitle')}</h1>
          <p className="text-gray-600 mb-6">{errorMessage || t('invitation:genericError')}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            {t('common:backToHome')}
          </Button>
        </div>
      </div>
    );
  }

  // État de sélection des utilisateurs
  if (status === 'select-users' && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <SEO translationKey="invitation" />
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <svg className="h-16 w-16 text-primary-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {t('invitation:joinGroupTitle')}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('invitation:youAreInvitedTo')} <span className="font-semibold">{groupName}</span>
            </p>
          </div>

          <UserSelector
            users={user ? [user, ...children] : children}
            currentUserId={user?.id}
            selectedUserIds={selectedUserIds}
            onSelectionChange={setSelectedUserIds}
          />

          <div className="mt-6 flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isAccepting}
            >
              {t('common:cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleAcceptInvitation}
              isLoading={isAccepting}
              disabled={selectedUserIds.length === 0 || isAccepting}
            >
              {t('invitation:acceptInvitation')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <SEO translationKey="invitation" />
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <svg className="h-16 w-16 text-primary-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {t('invitation:joinGroupTitle')}
        </h1>

        <p className="text-gray-600 mb-6">
          {t('invitation:youAreInvitedTo')} <span className="font-semibold">{groupName}</span>
        </p>

        {isAuthenticated ? (
          // Utilisateur connecté - il peut accepter l'invitation directement
          token ? (
            <Button
              variant="primary"
              onClick={handleAcceptInvitation}
              className="w-full"
            >
              {t('invitation:acceptInvitation')}
            </Button>
          ) : (
            <p className="text-gray-600 mb-4">
              {t('invitation:alreadyMember')}
            </p>
          )
        ) : (
          // Utilisateur non connecté - il doit se connecter ou s'inscrire
          <div>
            <p className="text-gray-600 mb-6">
              {t('invitation:needAccount')}
            </p>

            <div className="space-y-4">
              <Button
                variant="primary"
                onClick={handleLogin}
                className="w-full"
              >
                {t('auth:login.submit')}
              </Button>

              <div className="text-sm text-gray-500">{t('common:or')}</div>

              <Button
                variant="outline"
                onClick={handleRegister}
                className="w-full"
              >
                {t('auth:register.submit')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationJoin;
