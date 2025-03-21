import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant qui scrolle automatiquement vers le haut de la page lors des changements de route
 * Ce composant ne rend aucun élément visuel, il utilise seulement des effets de côté.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll vers le haut de la page lors des changements de route
    window.scrollTo(0, 0);
  }, [pathname]); // Déclenché uniquement lorsque le chemin de l'URL change

  return null; // Ce composant ne rend aucun élément visuel
};

export default ScrollToTop;
