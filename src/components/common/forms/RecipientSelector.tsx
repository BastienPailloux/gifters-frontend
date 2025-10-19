import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import Avatar from '../display/Avatar';
import { RecipientSelectorProps } from '../../../types';

/**
 * Composant de sélection de destinataires multiples avec des avatars
 * Les avatars sélectionnés sont entourés d'un rectangle coloré à coins arrondis
 */
const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  recipients,
  selectedIds,
  onChange,
  className = '',
  maxDisplayed = 50,
  maxSelection = Infinity,
  label,
  errorMessage = '',
}) => {
  const { t } = useTranslation('gifts');
  const [showAll, setShowAll] = useState(false);

  const displayedRecipients = showAll
    ? recipients
    : recipients.slice(0, maxDisplayed);

  const handleToggleRecipient = (id: string) => {
    if (selectedIds.includes(id)) {
      // Désélectionner
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      // Sélectionner (si la limite n'est pas atteinte)
      if (selectedIds.length < maxSelection) {
        onChange([...selectedIds, id]);
      }
    }
  };

  return (
    <div className={twMerge('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {maxSelection < Infinity && (
            <span className="text-gray-500 text-xs ml-1">
              ({t('giftIdeas.maxRecipients', { count: maxSelection })})
            </span>
          )}
        </label>
      )}

      <div className="flex flex-wrap gap-3 p-3 border rounded-md bg-white">
        {displayedRecipients.map((recipient) => {
          const isSelected = selectedIds.includes(recipient.id);
          return (
            <div
              key={recipient.id}
              onClick={() => handleToggleRecipient(recipient.id)}
              className={twMerge(
                'relative transition-all duration-200 p-1 rounded-lg cursor-pointer flex flex-col items-center',
                isSelected
                  ? 'bg-primary-100 border-2 border-primary-500'
                  : 'hover:bg-gray-100 border-2 border-transparent'
              )}
              title={recipient.name}
            >
              <Avatar
                name={recipient.name}
                size="md"
                variant={isSelected ? 'primary' : 'secondary'}
              />
              {isSelected && (
                <div className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
              <span className="text-xs mt-1 max-w-14 truncate text-center">
                {recipient.name}
              </span>
            </div>
          );
        })}

        {recipients.length > maxDisplayed && !showAll && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="text-primary-600 hover:text-primary-800 text-sm py-2"
          >
            {t('giftIdeas.viewAll', { count: recipients.length - maxDisplayed })}
          </button>
        )}

        {recipients.length === 0 && (
          <p className="text-gray-500 text-sm py-2">
            {t('giftIdeas.noRecipientsAvailable')}
          </p>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            {t(selectedIds.length === 1 ? 'giftIdeas.recipientsSelected' : 'giftIdeas.recipientsSelectedPlural', { count: selectedIds.length })}
          </p>
        </div>
      )}

      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default RecipientSelector;
