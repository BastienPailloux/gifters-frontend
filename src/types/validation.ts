/**
 * Interface pour le résultat d'une validation
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Type pour les options de traduction
 */
export type TranslationOptions = Record<string, string | number>;
