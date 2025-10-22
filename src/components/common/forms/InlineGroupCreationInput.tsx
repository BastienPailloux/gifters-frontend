import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { groupService } from '../../../services/api';
import useOutsideClick from '../../../hooks/useOutsideClick';
import useKeyPress from '../../../hooks/useKeyPress';
import { validateGroupName } from '../../../utils/validation';
import IconButton from './IconButton';

interface InlineGroupCreationInputProps {
  /** Callback appelée après la création réussie d'un groupe */
  onGroupCreated: () => void;
  /** ID de l'enfant pour lequel créer le groupe (optionnel) */
  childId?: string;
}

/**
 * Composant compact pour la création de groupe avec une interface inline
 * Affiche un bouton + qui ouvre un champ de saisie
 */
const InlineGroupCreationInput: React.FC<InlineGroupCreationInputProps> = ({
  onGroupCreated,
  childId,
}) => {
  const { t } = useTranslation(['common', 'navigation', 'validation']);
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fonction pour créer un groupe
  const createGroup = useCallback(() => {
    const validation = validateGroupName(newGroupName, t);

    if (validation.isValid) {
      setIsSubmitting(true);
      setError(null);

      const groupName = newGroupName.trim();

      groupService
        .createGroup(
          {
            name: groupName,
            description: '',
          },
          childId
        )
        .then(() => {
          setIsCreating(false);
          setNewGroupName('');
          setIsSubmitting(false);
          onGroupCreated();
        })
        .catch((error) => {
          console.error('Erreur lors de la création du groupe:', error);
          setIsSubmitting(false);
          setError(t('common:error') || 'Une erreur est survenue');
        });
    } else {
      setError(validation.errorMessage || t('validation:validation.invalid') || 'Nom de groupe invalide');
    }
  }, [newGroupName, onGroupCreated, childId, t]);

  // Fonction pour annuler la création de groupe
  const cancelGroupCreation = useCallback(() => {
    setIsCreating(false);
    setNewGroupName('');
    setError(null);
  }, []);

  // Utiliser nos hooks personnalisés
  useOutsideClick(inputRef, createGroup, isCreating);
  useKeyPress(
    {
      Enter: createGroup,
      Escape: cancelGroupCreation,
    },
    inputRef,
    isCreating
  );

  // Focus sur l'input quand on passe en mode création
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  return (
    <div>
      {isCreating ? (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className={`w-full px-2 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('navigation:sidemenu.groupNamePlaceholder') || 'Nom du groupe...'}
            disabled={isSubmitting}
            aria-invalid={error ? 'true' : 'false'}
            aria-required="true"
          />
          {isSubmitting && (
            <div className="absolute right-2 top-2">
              <div className="animate-spin h-3 w-3 border-2 border-primary-500 rounded-full border-t-transparent"></div>
            </div>
          )}
          {error && (
            <p className="mt-1 text-xs text-red-500" role="alert">
              {error}
            </p>
          )}
        </div>
      ) : (
        <IconButton
          icon={
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          }
          onClick={() => setIsCreating(true)}
          ariaLabel={t('navigation:sidemenu.createGroup')}
          variant="primary"
        />
      )}
    </div>
  );
};

export default InlineGroupCreationInput;
