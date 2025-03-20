import React from 'react';
import { Helmet, HelmetProvider as ReactHelmetProvider } from 'react-helmet-async';

interface SEOHelmetProviderProps {
  children: React.ReactNode;
}

/**
 * Fournit des balises meta de base à l'application entière.
 * Wrap l'application avec ce composant dans App.tsx.
 */
const SEOHelmetProvider: React.FC<SEOHelmetProviderProps> = ({ children }) => {
  return (
    <ReactHelmetProvider>
      <Helmet>
        {/* Balises de base qui s'appliquent à toute l'application */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta name="application-name" content="Gifters" />

        {/* Valeurs par défaut qui seront écrasées par les pages spécifiques */}
        <title>Gifters | Partagez vos souhaits, trouvez l'inspiration</title>
        <meta
          name="description"
          content="Gifters vous aide à créer et partager des listes de souhaits, organiser des tirages au sort et trouver l'inspiration pour vos cadeaux."
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph par défaut */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gifters" />
        <meta
          property="og:description"
          content="Créez et partagez vos listes de souhaits, organisez des tirages au sort et trouvez l'inspiration pour vos cadeaux."
        />
        <meta property="og:site_name" content="Gifters" />

        {/* Twitter Card par défaut */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gifters" />
        <meta
          name="twitter:description"
          content="Créez et partagez vos listes de souhaits, organisez des tirages au sort et trouvez l'inspiration pour vos cadeaux."
        />
      </Helmet>
      {children}
    </ReactHelmetProvider>
  );
};

export default SEOHelmetProvider;
