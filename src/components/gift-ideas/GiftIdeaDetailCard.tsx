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
  const { t } = useTranslation();

  // Vérifier si l'utilisateur peut interagir avec ce cadeau
  const canInteract = (): boolean => {
    if (!giftIdea || !currentUser) return false;

    // L'utilisateur ne peut pas acheter son propre cadeau
    const isRecipient = giftIdea.recipients.some((recipient) => recipient.id === currentUser.id);
    if (isRecipient) return false;

    // Si le cadeau est déjà acheté, personne ne peut interagir
    if (giftIdea.status === 'bought') return false;

    return true;
  };

  // Rendu des boutons d'action
  const renderActionButtons = () => {
    if (!canInteract()) return null;

    return (
      <div className="flex gap-2 mb-4">
        {giftIdea.status === 'proposed' && (
          <Button variant="primary" onClick={onMarkAsBuying}>
            {t('giftIdeas.markAsBuying')}
          </Button>
        )}
        {giftIdea.status === 'buying' && giftIdea.buyer?.id === currentUser?.id && (
          <Button variant="primary" onClick={onMarkAsBought}>
            {t('giftIdeas.markAsBought')}
          </Button>
        )}
        {giftIdea.link && (
          <a
            href={giftIdea.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {t('giftIdeas.visitStore')}
          </a>
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
        <h2 className="text-lg font-medium text-gray-900">{t('giftIdeas.details')}</h2>
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
                label={t('giftIdeas.proposedBy')}
                value={giftIdea.created_by?.name || ''}
              />

              {giftIdea.buyer && (
                <LabelValue
                  label={t('giftIdeas.onGoingBuyer')}
                  value={giftIdea.buyer.name}
                />
              )}
            </div>
          </div>
        )}

        {/* Colonne d'informations (ou colonne unique si pas d'image) */}
        <div>
          <LabelValue
            label={t('giftIdeas.for')}
            value={giftIdea.recipients.map((recipient) => recipient.name).join(', ')}
            isImportant
          />

          {giftIdea.price !== undefined && (
            <LabelValue
              label={t('giftIdeas.priceLabel')}
              value={formatPrice(giftIdea.price)}
              isImportant
            />
          )}

          {giftIdea.description && (
            <LabelValue
              label={t('giftIdeas.descriptionLabel')}
              value={<p className="whitespace-pre-wrap">{giftIdea.description}</p>}
            />
          )}

          {/* Afficher les informations de création/achat quand il n'y a pas d'image */}
          {!giftIdea.image_url && (
            <>
              <LabelValue
                label={t('giftIdeas.proposedBy')}
                value={giftIdea.created_by?.name || ''}
              />

              {giftIdea.buyer && (
                <LabelValue
                  label={t('giftIdeas.onGoingBuyer')}
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
