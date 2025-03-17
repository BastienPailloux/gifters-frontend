import React, { useEffect, useRef } from 'react';
import Confetti from 'react-confetti-boom';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import { CelebrationModalProps } from '../../../types/gift-ideas';

/**
 * Modal de célébration avec des confettis qui s'affiche lorsqu'un cadeau est marqué comme acheté
 */
const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  giftTitle = '',
  recipientName = ''
}) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);

  // Fermer automatiquement la modal après 5 secondes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // Construire le message avec les variables
  const celebrationMessage = giftTitle && recipientName
    ? t('celebration.giftMarkedAsBought', {
        giftTitle,
        recipientName
      })
    : t('celebration.genericSuccess');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton={true}
      closeOnOutsideClick={true}
      size="md"
    >
      <div ref={contentRef} className="text-center relative overflow-hidden">
        {/* Confettis limités à la modal */}
        <div className="absolute inset-0 pointer-events-none">
          <Confetti
            mode="fall"
            particleCount={80}
            colors={['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39']}
          />
        </div>

        <div className="mb-4 relative z-10">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-primary-100 text-primary-600">
            <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">
          {t('celebration.congratulations')}
        </h3>

        <p className="text-lg text-gray-600 mb-6 relative z-10">
          {celebrationMessage}
        </p>

        <div className="mt-6 relative z-10">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
            onClick={onClose}
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CelebrationModal;
