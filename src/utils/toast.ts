/**
 * Utilitaire simple pour afficher des notifications toast
 * Dans une version plus complète, ceci pourrait être remplacé par une bibliothèque comme react-toastify ou react-hot-toast
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

// Fonction simple pour afficher des alertes temporairement
// Dans une implémentation réelle, cette fonction serait remplacée par une vraie bibliothèque de toast
const showToast = (message: string, type: ToastType = 'info') => {
  // Pour l'instant, on utilise juste une alerte simple
  // Mais ceci pourrait être remplacé par une implémentation plus élégante
  alert(`${type.toUpperCase()}: ${message}`);
};

export const toast = {
  success: (message: string) => showToast(message, 'success'),
  error: (message: string) => showToast(message, 'error'),
  info: (message: string) => showToast(message, 'info'),
  warning: (message: string) => showToast(message, 'warning'),
};
