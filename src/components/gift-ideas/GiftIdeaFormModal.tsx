import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/modals/Modal';
import Button from '../common/forms/Button';
import { GiftIdeaFormModalProps, GiftMetadata } from '../../types/gift-ideas';
import { giftIdeaService } from '../../services/api';
import RecipientSelector from '../common/forms/RecipientSelector';
import GiftIdeaManualInput from './GiftIdeaManualInput';

export const GiftIdeaFormModal: React.FC<GiftIdeaFormModalProps> = ({
  isOpen,
  onClose,
  groupMembers,
  onSuccess,
  mode,
  giftIdea
}) => {
  const { t } = useTranslation();
  const [giftData, setGiftData] = useState<GiftMetadata>({
    title: '',
    description: '',
    price: undefined,
    imageUrl: '',
    link: ''
  });
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // S'assurer que tous les destinataires actuels sont disponibles dans la liste des membres
  const enhancedGroupMembers = useMemo(() => {
    // Si nous sommes en mode édition et que nous avons une idée cadeau
    if (mode === 'edit' && giftIdea && giftIdea.recipients) {
      // Obtenir les IDs existants des membres du groupe
      const existingMemberIds = new Set(groupMembers.map(m => m.id));

      // Créer une copie des membres du groupe
      const enhancedMembers = [...groupMembers];

      // Ajouter les destinataires actuels qui ne sont pas dans la liste des membres
      giftIdea.recipients.forEach(recipient => {
        if (!existingMemberIds.has(recipient.id)) {
          enhancedMembers.push({
            id: recipient.id,
            name: recipient.name,
            email: ''
          });
        }
      });

      return enhancedMembers;
    }

    // Sinon, retourner les membres du groupe tels quels
    return groupMembers;
  }, [mode, giftIdea, groupMembers]);

  useEffect(() => {
    if (mode === 'edit' && giftIdea) {
      setGiftData({
        title: giftIdea.title,
        description: giftIdea.description || '',
        price: giftIdea.price,
        imageUrl: giftIdea.image_url || '',
        link: giftIdea.link || ''
      });

      const recipientIds = giftIdea.recipients.map(r => r.id);
      setSelectedRecipients(recipientIds);
    } else {
      setGiftData({
        title: '',
        description: '',
        price: undefined,
        imageUrl: '',
        link: ''
      });
      setSelectedRecipients([]);
    }
  }, [mode, giftIdea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRecipients.length === 0) {
      return;
    }

    if (!giftData.title) {
      return;
    }

    setIsSubmitting(true);

    try {
      const giftPayload = {
        title: giftData.title || '',
        description: giftData.description || '',
        price: giftData.price || 0,
        link: giftData.link || '',
        image_url: giftData.imageUrl || '',
        recipient_ids: selectedRecipients
      };

      if (mode === 'create') {
        await giftIdeaService.createGiftIdea(giftPayload);
      } else if (mode === 'edit' && giftIdea) {
        await giftIdeaService.updateGiftIdea(giftIdea.id, giftPayload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting gift idea:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGiftDataChange = (field: keyof GiftMetadata, value: string | number) => {
    setGiftData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? t('giftIdeas.create') : t('giftIdeas.edit')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-6">
          <GiftIdeaManualInput
            giftData={giftData}
            onChange={handleGiftDataChange}
          />

          <RecipientSelector
            recipients={enhancedGroupMembers.map(member => ({
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

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || selectedRecipients.length === 0 || !giftData.title}
            isLoading={isSubmitting}
          >
            {mode === 'create' ? t('common.create') : t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
