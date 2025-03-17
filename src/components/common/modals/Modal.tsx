import React from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  hideCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

/**
 * Composant Modal générique réutilisable
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  hideCloseButton = false,
  closeOnOutsideClick = true,
  size = 'md',
  children
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  // Détermine la largeur maximale en fonction de la taille
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[size];

  // Gestionnaire pour fermer la modal lors d'un clic à l'extérieur
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
      onClick={handleOutsideClick}
    >
      <div className={`bg-white rounded-lg shadow-xl w-full ${maxWidthClass} mx-4 my-8`}>
        {title && (
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold">{title}</h2>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label={t('common.close')}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="p-6 max-h-[calc(80vh-4rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
