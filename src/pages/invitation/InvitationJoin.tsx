import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { invitationService, groupService } from '../../services/api';
import Button from '../../components/common/forms/Button';
import useAuth from '../../hooks/useAuth';
import { SEO } from '../../components/common/seo';

/**
 * Page pour rejoindre un groupe via une invitation
 * Gère les différents cas :
 * - Utilisateur déjà connecté
 * - Utilisateur non connecté mais qui a un compte
 * - Utilisateur sans compte
 */
const InvitationJoin: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('group');
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const [groupName, setGroupName] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId && !token) {
        setStatus('error');
        setErrorMessage(t('invitation.missingParameters'));
        return;
      }

      try {
        // Si nous avons un token, récupérer les informations de l'invitation
        if (token) {
          const invitation = await invitationService.getInvitation(token);
          if (invitation && invitation.group) {
            setGroupName(invitation.group.name);

            // Si l'utilisateur est connecté, accepter automatiquement l'invitation
            if (isAuthenticated && !isLoading) {
              try {
                await invitationService.acceptInvitation(token);
                setStatus('success');
                // Rediriger vers la page du groupe après 2 secondes
                setTimeout(() => {
                  navigate(`/groups/${invitation.group.id}`);
                }, 2000);
              } catch (acceptError) {
                setStatus('error');
                setErrorMessage(t('invitation.errorAccepting'));
              }
            } else {
              // L'utilisateur n'est pas connecté, mais nous avons les infos du groupe
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
        setErrorMessage(t('invitation.errorFetchingDetails'));
      }
    };

    // Attendre que le statut d'authentification soit déterminé
    if (!isLoading) {
      fetchGroupDetails();
    }
  }, [groupId, token, isAuthenticated, isLoading, navigate, t]);

  const handleAcceptInvitation = async () => {
    if (!token) return;

    try {
      setStatus('loading');
      await invitationService.acceptInvitation(token);
      setStatus('success');
      // Rediriger vers la page du groupe
      const invitation = await invitationService.getInvitation(token);
      navigate(`/groups/${invitation.group.id}`);
    } catch (acceptError) {
      setStatus('error');
      setErrorMessage(t('invitation.errorAccepting'));
    }
  };

  const handleLogin = () => {
    // Rediriger vers la page de connexion, avec un paramètre pour revenir à cette page
    navigate(`/login?redirect=/invitation/join?group=${groupId || ''}&token=${token || ''}`);
  };

  const handleRegister = () => {
    // Rediriger vers la page d'inscription, avec un paramètre pour revenir à cette page
    navigate(`/register?redirect=/invitation/join?group=${groupId || ''}&token=${token || ''}`);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <SEO translationKey="seo.invitation" />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <SEO translationKey="seo.invitation" />
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('invitation.errorTitle')}</h1>
          <p className="text-gray-600 mb-6">{errorMessage || t('invitation.genericError')}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            {t('common.backToHome')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <SEO translationKey="seo.invitation" />
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <svg className="h-16 w-16 text-primary-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {t('invitation.joinGroupTitle')}
        </h1>

        <p className="text-gray-600 mb-6">
          {t('invitation.youAreInvitedTo')} <span className="font-semibold">{groupName}</span>
        </p>

        {isAuthenticated ? (
          // Utilisateur connecté - il peut accepter l'invitation directement
          token ? (
            <Button
              variant="primary"
              onClick={handleAcceptInvitation}
              className="w-full"
            >
              {t('invitation.acceptInvitation')}
            </Button>
          ) : (
            <p className="text-gray-600 mb-4">
              {t('invitation.alreadyMember')}
            </p>
          )
        ) : (
          // Utilisateur non connecté - il doit se connecter ou s'inscrire
          <div>
            <p className="text-gray-600 mb-6">
              {t('invitation.needAccount')}
            </p>

            <div className="space-y-4">
              <Button
                variant="primary"
                onClick={handleLogin}
                className="w-full"
              >
                {t('auth.login.submit')}
              </Button>

              <div className="text-sm text-gray-500">{t('common.or')}</div>

              <Button
                variant="outline"
                onClick={handleRegister}
                className="w-full"
              >
                {t('auth.register.submit')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationJoin;
