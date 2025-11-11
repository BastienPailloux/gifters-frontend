import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/forms/Button';
import TextInput from '../common/forms/TextInput';
import Modal from '../common/modals/Modal';
import { invitationService } from '../../services/api';
import { InvitationModalProps } from '../../types/groups';

const InvitationModal: React.FC<InvitationModalProps> = ({
  groupId,
  groupName,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation(['groups', 'invitation']);
  const [activeTab, setActiveTab] = useState<'share' | 'email'>('share');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [invitationURL, setInvitationURL] = useState<string>('');

  // Récupérer un token d'invitation pour le partage
  useEffect(() => {
    if (!isOpen || !groupId) return;

    const fetchInvitationToken = async () => {
      try {
        setIsLoading(true);
        // Vérifier s'il existe déjà des invitations actives pour ce groupe
        const invitations = await invitationService.getGroupInvitations(groupId);

        if (invitations && invitations.length > 0) {
          // Utiliser le premier token d'invitation disponible
          setInvitationURL(`${window.location.origin}/invitation/join?token=${invitations[0].token}`);
        } else {
          // Créer une nouvelle invitation générique
          try {
            // Utiliser la méthode standard createInvitation qui ne nécessite pas d'email valide
            const newInvitation = await invitationService.createInvitation(groupId, {
              role: 'member'
            });
            setInvitationURL(`${window.location.origin}/invitation/join?token=${newInvitation.token}`);
          } catch (createErr) {
            console.error('Error creating invitation token:', createErr);
            setError(t('groups:errorCreatingInvitationLink'));
            // Fallback en cas d'erreur
            setInvitationURL(`${window.location.origin}/invitation/join?group=${groupId}`);
          }
        }
      } catch (err) {
        console.error('Error getting invitation token:', err);
        setError(t('groups:errorCreatingInvitationLink'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitationToken();
  }, [groupId, isOpen, t]);

  // Fonction pour partager via différentes plateformes
  const handleShare = (platform: 'copy' | 'email' | 'whatsapp') => {
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(invitationURL);
        setSuccess(t('groups:inviteLinkCopied'));
        setTimeout(() => setSuccess(null), 3000);
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(t('groups:inviteEmailSubject'))}&body=${encodeURIComponent(t('groups:inviteEmailBody', { link: invitationURL, groupName: groupName }))}`;
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(t('groups:inviteWhatsAppMessage', { link: invitationURL, groupName: groupName }))}`, '_blank');
        break;
      default:
        break;
    }
  };

  // Fonction pour envoyer une invitation par email
  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Utiliser la nouvelle API pour envoyer un email avec une invitation existante
      await invitationService.sendInvitationEmail(groupId, {
        email,
        message,
        role: 'member'
      });

      setSuccess(t('groups:invitationSent'));
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError(t('groups:errorSendingInvitation'));
    } finally {
      setIsLoading(false);
    }
  };

  // Contenu personnalisé de l'en-tête pour les onglets
  const customHeader = (
    <div className="flex border-b w-full">
      <button
        className={`flex-1 py-3 px-4 font-medium text-center ${
          activeTab === 'share' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'
        }`}
        onClick={() => setActiveTab('share')}
      >
        {t('groups:shareLink')}
      </button>
      <button
        className={`flex-1 py-3 px-4 font-medium text-center ${
          activeTab === 'email' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'
        }`}
        onClick={() => setActiveTab('email')}
      >
        {t('groups:sendEmail')}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('groups:invitePeople')}
      size="md"
    >
      {customHeader}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('common:loading')}
        </div>
      )}

      {activeTab === 'share' ? (
        <div>
          <p className="mb-4">{t('groups:shareInvitationDescription')}</p>

          <div className="mb-4 flex items-center p-2 bg-gray-50 rounded-md">
            <input
              type="text"
              value={invitationURL}
              readOnly
              className="flex-1 bg-transparent border-0 focus:ring-0"
            />
            <button
              onClick={() => handleShare('copy')}
              className="ml-2 p-2 text-gray-500 hover:text-primary-600"
              aria-label={t('common:copy')}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => handleShare('email')}
              className="flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {t('common:email')}
            </Button>

            <Button
              variant="outline"
              onClick={() => handleShare('whatsapp')}
              className="flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 448 512">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
              WhatsApp
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSendInvitation}>
          <div className="mb-4">
            <TextInput
              label={t('common:email')}
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              placeholder={t('groups:enterEmail')}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('common:message')} ({t('common:optional')})
            </label>
            <textarea
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder={t('groups:enterMessage')}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !email}
            >
              {isLoading ? t('common:sending') : t('groups:sendInvitation')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default InvitationModal;
