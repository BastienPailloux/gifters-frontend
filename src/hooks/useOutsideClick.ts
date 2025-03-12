import { useEffect, RefObject } from 'react';

/**
 * Hook qui permet de détecter les clics en dehors d'un élément référencé.
 * @param ref La référence de l'élément à surveiller
 * @param callback La fonction à appeler lorsqu'un clic est détecté en dehors de l'élément
 * @param active Indique si la détection des clics extérieurs est active (par défaut: true)
 */
const useOutsideClick = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
  active: boolean = true
): void => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (active && ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    if (active) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (active) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [ref, callback, active]);
};

export default useOutsideClick;
