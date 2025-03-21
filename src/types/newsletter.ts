/**
 * Propriétés pour le formulaire d'abonnement à la newsletter
 */
export interface NewsletterSubscriptionFormProps {
  variant?: 'inline' | 'stacked';
  className?: string;
  showTitle?: boolean;
  onSuccess?: () => void;
}
