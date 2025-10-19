import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '../common/forms';
import { FiSend } from 'react-icons/fi';
import { newsletterService } from '../../services/api';
import { AxiosError } from 'axios';
import { NewsletterSubscriptionFormProps } from '../../types/newsletter';

/**
 * Composant de formulaire d'abonnement à la newsletter qui utilise l'API backend
 */
const NewsletterSubscriptionForm: React.FC<NewsletterSubscriptionFormProps> = ({
  className = '',
  buttonText,
  placeholderText,
  successMessage,
  errorMessage,
  redirectUrl,
  listId
}) => {
  const { t } = useTranslation('contact');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorDetails, setErrorDetails] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorDetails('');

    try {
      await newsletterService.subscribe({
        email,
        list_id: listId,
        redirect_url: redirectUrl
      });

      setSubmitStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitStatus('error');

      // Récupérer le message d'erreur de la réponse d'axios si disponible
      let errorResponseMessage = '';
      if (error instanceof AxiosError && error.response?.data?.error) {
        errorResponseMessage = error.response.data.error;
      }

      setErrorDetails(errorResponseMessage || errorMessage || t('contact:newsletter.errors.generic', 'Une erreur est survenue lors de l\'abonnement à la newsletter.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      {submitStatus === 'success' ? (
        <div className="text-green-600 mb-4">
          {successMessage || t('contact:newsletter.subscriptionSuccess', 'Vous êtes désormais abonné à notre newsletter !')}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholderText || t('contact:footer.newsletter.placeholder', 'Entrez votre email')}
            required
            aria-label={t('contact:newsletter.emailLabel', 'Adresse email pour la newsletter')}
            error={submitStatus === 'error' ? errorDetails : undefined}
            endIcon={<FiSend className="text-gray-400" />}
            className="focus:bg-white transition-colors duration-200"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {buttonText || t('contact:footer.newsletter.button', 'S\'abonner')}
          </Button>

          <p className="text-xs text-gray-500 mt-2">
            {t('contact:footer.newsletter.privacy', 'Nous respectons votre vie privée. Désabonnez-vous à tout moment.')}
          </p>
        </form>
      )}
    </div>
  );
};

export default NewsletterSubscriptionForm;
