import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/modals/Modal';
import Button from '../common/forms/Button';
import RecipientSelector from '../common/forms/RecipientSelector';
import { giftIdeaService } from '../../services/api';
import { GiftIdeaFromUrl, GiftIdeaManualInput, GiftMetadata } from '../gift_ideas';

interface Member {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface GiftIdeaCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupMembers: Member[];
  onSuccess: () => void;
}

enum CreationMode {
  URL = 'url',
  MANUAL = 'manual'
}

const GiftIdeaCreationModal: React.FC<GiftIdeaCreationModalProps> = ({
  isOpen,
  onClose,
  groupId,
  groupMembers,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<CreationMode>(CreationMode.URL);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [giftData, setGiftData] = useState<GiftMetadata>({
    title: '',
    description: '',
    price: undefined,
    imageUrl: ''
  });

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
        url: mode === CreationMode.URL ? giftData.imageUrl : undefined,
        recipient_ids: selectedRecipients,
        group_id: groupId
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating gift idea:', error);
      alert(t('giftIdeas.creationError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire pour basculer entre les modes de création
  const handleModeChange = (newMode: CreationMode) => {
    setMode(newMode);
    // Réinitialiser les données si on change de mode
    if (newMode === CreationMode.MANUAL) {
      setGiftData({
        title: '',
        description: '',
        price: undefined,
        imageUrl: ''
      });
    }
  };

  // Gestionnaire pour le changement des données du cadeau
  const handleGiftDataChange = (field: keyof GiftMetadata, value: string | number) => {
    setGiftData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestionnaire pour les métadonnées récupérées de l'URL
  const handleMetadataFetched = (metadata: GiftMetadata) => {
    setGiftData(metadata);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('giftIdeas.createNew')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection du mode de création */}
        <div className="flex space-x-4 border-b pb-4 sticky top-0 bg-white z-10">
          <button
            type="button"
            className={`py-2 px-4 rounded-t-lg ${
              mode === CreationMode.URL
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleModeChange(CreationMode.URL)}
          >
            {t('giftIdeas.fromUrl')}
          </button>
          <button
            type="button"
            className={`py-2 px-4 rounded-t-lg ${
              mode === CreationMode.MANUAL
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleModeChange(CreationMode.MANUAL)}
          >
            {t('giftIdeas.manualInput')}
          </button>
        </div>

        <div className="space-y-6">
          {/* Contenu selon le mode */}
          {mode === CreationMode.URL ? (
            <GiftIdeaFromUrl
              onMetadataFetched={handleMetadataFetched}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              giftData={giftData}
              onChange={handleGiftDataChange}
            />
          ) : (
            <GiftIdeaManualInput
              giftData={giftData}
              onChange={handleGiftDataChange}
            />
          )}

          {/* Sélection des destinataires */}
          <div className="space-y-2">
            <RecipientSelector
              recipients={groupMembers.map(member => ({
                id: member.id,
                name: member.name,
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
            disabled={isLoading || selectedRecipients.length === 0 || !giftData.title}
          >
            {isLoading ? t('common.processing') : t('giftIdeas.createButton')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GiftIdeaCreationModal;
