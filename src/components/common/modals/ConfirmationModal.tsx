import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import Button from '../forms/Button';
import { ConfirmationModalProps } from '../../../types/ui';

/**
 * Composant réutilisable pour afficher une modal de confirmation
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText,
  cancelText,
  isLoading = false,
  confirmVariant = 'danger',
  size = 'sm'
}) => {
  const { t } = useTranslation();

  // Valeurs par défaut pour les textes
  const defaultTitle = t('common.confirmation.title');
  const defaultMessage = t('common.confirmation.message');
  const defaultConfirmText = t('common.confirmation.confirm');
  const defaultCancelText = t('common.confirmation.cancel');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || defaultTitle}
      size={size}
    >
      <div className="space-y-4">
        <p className="text-gray-700">{message || defaultMessage}</p>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText || defaultCancelText}
          </Button>

          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {confirmText || defaultConfirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
