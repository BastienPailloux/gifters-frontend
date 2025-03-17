import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/modals/Modal';
import Button from '../common/forms/Button';
import RecipientSelector from '../common/forms/RecipientSelector';
// TODO: SCRAPING_FEATURE - Import commenté temporairement mais conservé pour référence
// import ToggleSelect from '../common/forms/ToggleSelect';
import { giftIdeaService } from '../../services/api';
import {
  // TODO: SCRAPING_FEATURE - Import commenté temporairement mais conservé pour référence
  // GiftIdeaFromUrl,
  GiftIdeaManualInput,
  GiftMetadata
} from '../gift_ideas';
import { GiftIdeaCreationModalProps } from '../../types/groups';

/**
 * Modal pour créer une nouvelle idée cadeau
 *
 * TODO: SCRAPING_FEATURE - Réactiver la fonctionnalité de scraping de sites web quand celle-ci sera stable
 * Pour l'instant, seule la saisie manuelle est disponible.
 */
const GiftIdeaCreationModal: React.FC<GiftIdeaCreationModalProps> = ({
  isOpen,
  onClose,
  groupMembers,
  onSuccess
}) => {
  const { t } = useTranslation();

  // TODO: SCRAPING_FEATURE - L'option URL est temporairement désactivée
  // mais on garde la logique en place pour une activation future

  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [giftData, setGiftData] = useState<GiftMetadata>({
    title: '',
    description: '',
    price: undefined,
    imageUrl: ''
  });

  // Options du toggle pour les modes de création
  // TODO: SCRAPING_FEATURE - Temporairement désactivé, à réactiver plus tard
  // const toggleOptions = [
  //   { value: CreationMode.URL, label: t('giftIdeas.fromUrl') },
  //   { value: CreationMode.MANUAL, label: t('giftIdeas.manualInput') }
  // ];

  // Gestionnaire pour la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRecipients.length === 0) {
      alert(t('giftIdeas.selectRecipient'));
      return;
    }

    if (!giftData.title) {
      alert(t('giftIdeas.titleRequired'));
      return;
    }

    setIsLoading(true);

    try {
      await giftIdeaService.createGiftIdea({
        title: giftData.title || '',
        description: giftData.description || '',
        price: giftData.price || 0,
        link: giftData.link,
        image_url: giftData.imageUrl,
        recipient_ids: selectedRecipients,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating gift idea:', error);

      // Afficher un message d'erreur plus spécifique si possible
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { errors?: string[] } } };
        if (axiosError.response?.data?.errors?.length) {
          alert(axiosError.response.data.errors.join('\n'));
        } else {
          alert(t('giftIdeas.creationError'));
        }
      } else {
        alert(t('giftIdeas.creationError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire pour le changement des données du cadeau
  const handleGiftDataChange = (field: keyof GiftMetadata, value: string | number) => {
    setGiftData((prev: GiftMetadata) => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestionnaire pour les métadonnées récupérées de l'URL
  // TODO: SCRAPING_FEATURE - Fonction maintenue pour une future réactivation
  // const handleMetadataFetched = (metadata: GiftMetadata) => {
  //   setGiftData(metadata);
  // };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('giftIdeas.createNew')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/*
          TODO: SCRAPING_FEATURE - Le toggle est désactivé pour l'instant puisqu'il n'y a qu'une option
          À réactiver quand la fonctionnalité de scraping sera prête
        */}
        {/* {toggleOptions.length > 1 && (
          <ToggleSelect
            options={toggleOptions}
            value={mode}
            onChange={handleModeChange}
            className="sticky top-0 bg-white z-10"
          />
        )} */}

        <div className="space-y-6">
          {/* Contenu selon le mode - actuellement seule la saisie manuelle est activée */}
          {/* TODO: SCRAPING_FEATURE - L'option URL est temporairement désactivée */}
          {/* {mode === CreationMode.URL ? (
            <GiftIdeaFromUrl
              onMetadataFetched={handleMetadataFetched}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              giftData={giftData}
              onChange={handleGiftDataChange}
            />
          ) : ( */}
            <GiftIdeaManualInput
              giftData={giftData}
              onChange={handleGiftDataChange}
            />
          {/* )} */}

          {/* Sélection des destinataires */}
          <div className="space-y-2">
            <RecipientSelector
              recipients={groupMembers.map(member => ({
                id: member.id,
                name: member.name || '',
                email: member.email
              }))}
              selectedIds={selectedRecipients}
              onChange={setSelectedRecipients}
              label={t('giftIdeas.selectRecipients')}
              errorMessage={selectedRecipients.length === 0 ? t('giftIdeas.recipientRequired') : ''}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-white pb-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={
              isLoading ||
              selectedRecipients.length === 0 ||
              !giftData.title ||
              !giftData.link ||
              !giftData.link.match(/^https?:\/\/.+/)
            }
          >
            {isLoading ? t('common.processing') : t('giftIdeas.createButton')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GiftIdeaCreationModal;
