import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/display/Card';
import Input from '../../components/common/forms/Input';
import Button from '../../components/common/forms/Button';
import BackButton from '../../components/common/navigation/BackButton';
import { invitationService } from '../../services/api';

/**
 * Page pour entrer un code d'invitation ou un lien d'invitation
 */
const InvitationInput: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [invitationInput, setInvitationInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Analyser l'entrée pour extraire le token d'invitation
   * L'entrée peut être:
   * - Un code d'invitation (juste le token)
   * - Une URL complète contenant le token
   */
  const parseInvitationInput = (input: string): string | null => {
    // Nettoyer l'entrée
    const trimmedInput = input.trim();
    if (!trimmedInput) return null;

    // Cas 1: C'est une URL contenant ?token=xxx ou &token=xxx
    if (trimmedInput.includes('token=')) {
      const urlObj = new URL(trimmedInput, window.location.origin);
      const token = urlObj.searchParams.get('token');
      return token;
    }

    // Cas 2: C'est juste le token ou un code d'invitation
    // Nous supposons que tout ce qui n'est pas une URL est un token
    return trimmedInput;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Extraire le token de l'entrée
    const token = parseInvitationInput(invitationInput);
    if (!token) {
      setError(t('invitation.invalidInput'));
      return;
    }

    setIsLoading(true);
    try {
      // Vérifier que l'invitation existe
      const invitation = await invitationService.getInvitation(token);

      if (invitation && invitation.group) {
        // Rediriger vers la page d'invitation avec le token extrait
        navigate(`/invitation/join?token=${token}`);
      } else {
        setError(t('invitation.invalidInvitation'));
      }
    } catch (err) {
      console.error('Error checking invitation:', err);
      setError(t('invitation.errorCheckingInvitation'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <BackButton onClick={() => navigate(-1)} />
      </div>

      <Card>
        <h1 className="text-2xl font-bold mb-6">{t('invitation.joinGroup')}</h1>

        <p className="text-gray-600 mb-6">
          {t('invitation.enterInvitationDescription')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('invitation.invitationCode')}
            value={invitationInput}
            onChange={(e) => setInvitationInput(e.target.value)}
            placeholder={t('invitation.invitationPlaceholder')}
            error={error}
            fullWidth
            required
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={!invitationInput.trim() || isLoading}
            >
              {t('invitation.proceed')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default InvitationInput;
