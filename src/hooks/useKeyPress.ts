import { useEffect, useCallback, RefObject } from 'react';
import { KeyHandlers } from '../types/hooks';

/**
 * Hook pour détecter l'appui sur des touches spécifiques
 * @param keyHandlers - Objet avec les touches et leurs gestionnaires
 * @param targetRef - Référence optionnelle de l'élément à surveiller (si non fourni, écouteur global)
 * @param active - Indique si les écouteurs sont actifs
 */
const useKeyPress = <T extends HTMLElement>(
  keyHandlers: KeyHandlers,
  targetRef?: RefObject<T | null>,
  active: boolean = true
): void => {
  // Créer un gestionnaire d'événements mémorisé
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!active) return;

      // Récupérer la touche appuyée
      const { key } = event;

      // Si un gestionnaire existe pour cette touche, l'exécuter
      if (keyHandlers[key]) {
        event.preventDefault();
        keyHandlers[key]();
      }
    },
    [keyHandlers, active]
  );

  useEffect(() => {
    if (!active) return;

    // Si une référence est fournie et qu'elle a un current, nous écoutons les événements sur cet élément
    // sinon, nous utilisons le document entier
    const target = (targetRef?.current && targetRef.current) || document;

    // Ajouter l'écouteur d'événements
    target.addEventListener('keydown', handleKeyDown as EventListener);

    // Nettoyer l'écouteur d'événements
    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [handleKeyDown, targetRef, active]);
};

export default useKeyPress;
