/**
 * Validations liées aux groupes
 */

import { ValidationResult, TranslationOptions } from '../../types/validation';

// Constantes pour la validation
export const MIN_GROUP_NAME_LENGTH = 3;
export const MAX_GROUP_NAME_LENGTH = 50;

/**
 * Valide le nom d'un groupe
 * @param name Nom du groupe à valider
 * @param t Fonction de traduction (optionnelle)
 * @returns ValidationResult contenant le résultat de la validation
 */
export const validateGroupName = (
  name: string,
  t?: (key: string, options?: TranslationOptions) => string
): ValidationResult => {
  const trimmedName = name.trim();

  // Validation du nom vide
  if (!trimmedName) {
    return {
      isValid: false,
      errorMessage: t ? t('validation:groupName.required') : 'Le nom du groupe est requis'
    };
  }

  // Validation de la longueur minimale
  if (trimmedName.length < MIN_GROUP_NAME_LENGTH) {
    return {
      isValid: false,
      errorMessage: t ?
        t('validation:groupName.tooShort', { min: MIN_GROUP_NAME_LENGTH }) :
        `Le nom doit contenir au moins ${MIN_GROUP_NAME_LENGTH} caractères`
    };
  }

  // Validation de la longueur maximale
  if (trimmedName.length > MAX_GROUP_NAME_LENGTH) {
    return {
      isValid: false,
      errorMessage: t ?
        t('validation:groupName.tooLong', { max: MAX_GROUP_NAME_LENGTH }) :
        `Le nom ne doit pas dépasser ${MAX_GROUP_NAME_LENGTH} caractères`
    };
  }

  // Validation des caractères spéciaux ou potentiellement dangereux
  const forbiddenPattern = /[<>{}[\]\\]/;
  if (forbiddenPattern.test(trimmedName)) {
    return {
      isValid: false,
      errorMessage: t ?
        t('validation:groupName.invalidCharacters') :
        'Le nom contient des caractères non autorisés'
    };
  }

  // Le nom est valide
  return { isValid: true };
};
