import { useEffect, RefObject, useCallback } from 'react';

/**
 * Hook pour détecter les clics en dehors d'un élément spécifié
 * @param ref - Référence React à l'élément à surveiller
 * @param handler - Fonction à exécuter lorsqu'un clic est détecté en dehors de l'élément
 * @param active - Indique si la détection est active ou non (utile pour les modales conditionnelles)
 */
const useOutsideClick = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  active: boolean = true
): void => {
  // Mémoriser le gestionnaire d'événements pour éviter des re-render inutiles
  const memoizedHandler = useCallback(
    (event: MouseEvent) => {
      // Vérifier que la référence est définie et que le clic n'est pas à l'intérieur de l'élément
      if (active && ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    },
    [ref, handler, active]
  );

  useEffect(() => {
    // N'ajouter l'écouteur que si le hook est actif
    if (active) {
      document.addEventListener('mousedown', memoizedHandler);

      // Nettoyer l'écouteur à la désactivation du hook ou au démontage du composant
      return () => {
        document.removeEventListener('mousedown', memoizedHandler);
      };
    }
    return undefined;
  }, [active, memoizedHandler]);
};

export default useOutsideClick;
