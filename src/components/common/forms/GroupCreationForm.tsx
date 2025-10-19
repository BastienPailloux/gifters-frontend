import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { groupService } from '../../../services/api';
import useOutsideClick from '../../../hooks/useOutsideClick';
import useKeyPress from '../../../hooks/useKeyPress';
import { validateGroupName } from '../../../utils/validation';
import { GroupCreationFormProps } from '../../../types';

/**
 * Composant pour la création de groupe avec une interface utilisateur intuitive
 * Il affiche soit un bouton, soit un champ de saisie selon l'état
 */
const GroupCreationForm: React.FC<GroupCreationFormProps> = ({
  onGroupCreated,
  className = '',
  buttonText,
  inputOnly = false,
  refetchOnCreate = true,
}) => {
  const { t } = useTranslation(['navigation', 'validation']);
  const [isCreatingGroup, setIsCreatingGroup] = useState(inputOnly);
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fonction pour créer un groupe, mémorisée pour éviter des re-render inutiles
  const createGroup = useCallback(() => {
    const validation = validateGroupName(newGroupName, t);

    if (validation.isValid) {
      setIsCreating(true);
      setError(null);

      const groupName = newGroupName.trim();

      groupService.createGroup({
        name: groupName,
        description: ''
      })
        .then(() => {
          setIsCreatingGroup(false);
          setNewGroupName('');
          setIsCreating(false);

          // Appeler le callback si fourni
          if (onGroupCreated) {
            onGroupCreated();
          } else {
            // Pas de callback fourni, mais on peut quand même refetch si demandé
            if (refetchOnCreate) {
              // Déclencher un événement personnalisé pour informer les composants parents
              // qu'un nouveau groupe a été créé (plus léger qu'un rechargement complet)
              const event = new CustomEvent('groupCreated', {
                detail: { timestamp: new Date().getTime() }
              });
              document.dispatchEvent(event);
            }
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la création du groupe:", error);
          setIsCreating(false);
          setError(t('common.error') || 'Une erreur est survenue');
        });
    } else {
      // Afficher l'erreur de validation
      setError(validation.errorMessage || t('validation.invalid') || 'Nom de groupe invalide');
    }
  }, [newGroupName, onGroupCreated, inputOnly, refetchOnCreate, t]);

  // Fonction pour annuler la création de groupe
  const cancelGroupCreation = useCallback(() => {
    if (!inputOnly) {
      setIsCreatingGroup(false);
      setNewGroupName('');
      setError(null);
    }
  }, [inputOnly]);

  // Utiliser notre hook personnalisé pour gérer les clics en dehors
  useOutsideClick(inputRef, createGroup, isCreatingGroup);

  // Utiliser notre hook pour gérer les touches spécifiques
  useKeyPress(
    {
      Enter: createGroup,
      Escape: cancelGroupCreation,
    },
    inputRef,
    isCreatingGroup
  );

  // Focus sur l'input quand on passe en mode création
  useEffect(() => {
    if (isCreatingGroup && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreatingGroup]);

  // Afficher l'input ou le bouton selon l'état
  return (
    <div className={className}>
      <div className="relative">
        {isCreatingGroup ? (
          <div className="transition-all duration-200 ease-in-out transform-gpu"
               data-testid="group-input-container"
               role="form"
               aria-label={t('sidemenu.createGroupFormLabel') || "Formulaire de création de groupe"}>
            <input
              ref={inputRef}
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                error ? 'border-red-500' : ''
              }`}
              placeholder={t('sidemenu.groupNamePlaceholder') || 'Enter group name...'}
              disabled={isCreating}
              data-testid="group-name-input"
              aria-invalid={error ? 'true' : 'false'}
              aria-required="true"
              aria-describedby={error ? "group-name-error" : undefined}
            />
            {error && (
              <p
                className="mt-1 text-xs text-red-500"
                id="group-name-error"
                role="alert"
              >
                {error}
              </p>
            )}
            {isCreating && (
              <div
                className="absolute right-3 top-2.5"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="animate-spin h-4 w-4 border-2 border-primary-500 rounded-full border-t-transparent"></div>
                <span className="sr-only">{t('common.loading') || 'Chargement en cours'}</span>
              </div>
            )}
          </div>
        ) : !inputOnly ? (
          <button
            onClick={() => setIsCreatingGroup(true)}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 w-full transition-all duration-200 ease-in-out"
            disabled={isCreating}
            data-testid="create-group-button"
            aria-label={t('sidemenu.createGroup') || 'Créer un groupe'}
          >
            <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {buttonText || t('sidemenu.createGroup')}
          </button>
        ) : null}
      </div>
    </div>
  );
};

// Exporter le composant avec mémoisation pour éviter les re-rendus inutiles
export default React.memo(GroupCreationForm);
