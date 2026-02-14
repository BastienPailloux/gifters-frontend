import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../common/display/Card';
import Image from '../common/display/Image';
import LabelValue from '../common/display/LabelValue';
import Button from '../common/forms/Button';
import { GiftIdeaDetailCardProps } from '../../types';

/**
 * Composant GiftIdeaDetailCard - Affiche les détails d'une idée cadeau dans une carte structurée
 * Gère l'affichage de l'image, des informations et des boutons d'action
 */
const GiftIdeaDetailCard: React.FC<GiftIdeaDetailCardProps> = ({
  giftIdea,
  currentUser,
  onMarkAsBuying,
  onMarkAsBought,
  formatPrice
}) => {
  const { t } = useTranslation('gifts');

  // Permissions calculées par le backend
  const canMarkAsBuying = giftIdea?.can_mark_as_buying ?? false;
  const canMarkAsBought = giftIdea?.can_mark_as_bought ?? false;

  // Vérifier si l'utilisateur est le destinataire
  const isRecipient = (): boolean => {
    if (!giftIdea || !currentUser) return false;
    return giftIdea.recipients.some((recipient) => recipient.id === currentUser.id);
  };

  // Vérifier si l'acheteur doit être affiché
  const shouldShowBuyer = (): boolean => {
    return Boolean(giftIdea?.buyer) && !isRecipient();
  };

  // Obtenir le label approprié pour l'acheteur selon le statut
  const getBuyerLabel = (): string => {
    if (giftIdea.status === 'bought') {
      return t('gifts:giftIdeas.boughtBy');
    }
    return t('gifts:giftIdeas.onGoingBuyer');
  };

  // Rendu des boutons d'action
  const renderActionButtons = () => {
    const hasActions = canMarkAsBuying || canMarkAsBought || giftIdea.link;
    
    if (!hasActions) return null;

    // Déterminer le texte du bouton "Mark as bought" avec le nom de l'acheteur
    const getMarkAsBoughtText = () => {
      if (giftIdea.buyer) {
        // Si l'acheteur est le current user, afficher "Je l'ai acheté"
        if (giftIdea.buyer.id === currentUser?.id) {
          return t('gifts:giftIdeas.markAsBought');
        }
        // Sinon afficher "[Prénom] l'a acheté"
        return t('gifts:giftIdeas.markAsBoughtFor', { name: giftIdea.buyer.name });
      }
      return t('gifts:giftIdeas.markAsBought');
    };

    return (
      <div className="flex gap-2 mb-4 flex-wrap">
        {canMarkAsBuying && (
          <Button variant="primary" onClick={onMarkAsBuying}>
            {t('gifts:giftIdeas.markAsBuying')}
          </Button>
        )}
        {canMarkAsBought && (
          <Button variant="primary" onClick={onMarkAsBought}>
            {getMarkAsBoughtText()}
          </Button>
        )}

        {giftIdea.link && (
          <Button variant="outline" onClick={() => window.open(giftIdea.link, '_blank')}>
            {t('gifts:giftIdeas.visitStore')}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card
      variant="elevated"
      className="mb-6"
    >
      {/* En-tête avec les boutons d'action */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between">
        <h2 className="text-lg font-medium text-gray-900">{t('gifts:giftIdeas.details')}</h2>
        {renderActionButtons()}
      </div>

      {/* Contenu principal */}
      <div className={`p-6 grid ${giftIdea.image_url ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {/* Colonne de gauche avec l'image (si disponible) */}
        {giftIdea.image_url && (
          <div className="flex flex-col">
            <LabelValue
              value={
                <Image
                  src={giftIdea.image_url}
                  alt={giftIdea.title}
                  objectFit="contain"
                  aspectRatio="auto"
                  rounded
                  containerClassName="max-h-200"
                />
              }
            />

            <div className="mt-auto">
              <LabelValue
                label={t('gifts:giftIdeas.proposedBy')}
                value={giftIdea.created_by?.name || ''}
              />

              {shouldShowBuyer() && giftIdea.buyer && (
                <LabelValue
                  label={getBuyerLabel()}
                  value={giftIdea.buyer.name}
                />
              )}
            </div>
          </div>
        )}

        {/* Colonne d'informations (ou colonne unique si pas d'image) */}
        <div>
          <LabelValue
            label={t('gifts:giftIdeas.for')}
            value={giftIdea.recipients.map((recipient) => recipient.name).join(', ')}
            isImportant
          />

          {giftIdea.price !== undefined && (
            <LabelValue
              label={t('gifts:giftIdeas.priceLabel')}
              value={formatPrice(giftIdea.price)}
              isImportant
            />
          )}

          {giftIdea.description && (
            <LabelValue
              label={t('gifts:giftIdeas.descriptionLabel')}
              value={<p className="whitespace-pre-wrap">{giftIdea.description}</p>}
            />
          )}

          {/* Afficher les informations de création/achat quand il n'y a pas d'image */}
          {!giftIdea.image_url && (
            <>
              <LabelValue
                label={t('gifts:giftIdeas.proposedBy')}
                value={giftIdea.created_by?.name || ''}
              />

              {shouldShowBuyer() && giftIdea.buyer && (
                <LabelValue
                  label={getBuyerLabel()}
                  value={giftIdea.buyer.name}
                />
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GiftIdeaDetailCard;
