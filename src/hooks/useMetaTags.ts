import { useEffect } from 'react';
import { MetaTagsOptions } from '../types';

/**
 * Hook personnalisé qui injecte et met à jour directement les métadonnées dans le head du document
 * Solution compatible avec React 19 qui ne dépend pas de react-helmet
 */
const useMetaTags = (options: MetaTagsOptions) => {
  useEffect(() => {
    // Mettre à jour le titre du document
    if (options.title) {
      document.title = options.title;
    }

    // Fonction pour mettre à jour ou créer une balise meta
    const updateMeta = (name: string, content?: string | string[], isProperty = false) => {
      if (content === undefined || content === null) return;

      // Convertir les tableaux en chaînes
      const contentValue = Array.isArray(content) ? content.join(', ') : content;

      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);

      if (meta) {
        meta.setAttribute('content', contentValue);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        meta.setAttribute('content', contentValue);
        document.head.appendChild(meta);
      }
    };

    // Fonction pour mettre à jour ou créer un lien
    const updateLink = (rel: string, href?: string) => {
      if (!href) return;

      let link = document.querySelector(`link[rel="${rel}"]`);

      if (link) {
        link.setAttribute('href', href);
      } else {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('href', href);
        document.head.appendChild(link);
      }
    };

    // Mettre à jour l'attribut lang sur html
    if (options.lang) {
      document.documentElement.setAttribute('lang', options.lang);
    }

    // Mettre à jour les balises meta de base
    updateMeta('description', options.description);
    updateMeta('keywords', options.keywords);
    if (options.robots) {
      updateMeta('robots', options.robots);
    }

    // Open Graph
    updateMeta('og:title', options.ogTitle, true);
    updateMeta('og:description', options.ogDescription, true);
    updateMeta('og:type', options.ogType, true);
    updateMeta('og:site_name', options.ogSiteName, true);
    updateMeta('og:url', options.ogUrl, true);
    updateMeta('og:image', options.ogImage, true);

    // Twitter Card
    updateMeta('twitter:card', options.twitterCard);
    updateMeta('twitter:title', options.twitterTitle);
    updateMeta('twitter:description', options.twitterDescription);
    updateMeta('twitter:image', options.twitterImage);
    if (options.twitterCreator) {
      updateMeta('twitter:creator', options.twitterCreator);
    }

    // Métadonnées d'article
    if (options.publishedTime) {
      updateMeta('article:published_time', options.publishedTime, true);
    }
    if (options.modifiedTime) {
      updateMeta('article:modified_time', options.modifiedTime, true);
    }
    if (options.author) {
      updateMeta('article:author', options.author, true);
    }

    // URL canonique
    updateLink('canonical', options.canonical);

    // Lien d'alternance de langue (hreflang)
    if (options.lang && options.ogUrl) {
      updateLink('alternate', options.ogUrl);
      document.querySelector(`link[rel="alternate"]`)?.setAttribute('hreflang', options.lang);
    }

    // Nettoyage optionnel lors du démontage (si nécessaire)
    return () => {
      // Pas de nettoyage spécifique pour l'instant
    };
  }, [
    options.title,
    options.description,
    options.keywords,
    options.ogTitle,
    options.ogDescription,
    options.ogImage,
    options.ogType,
    options.ogSiteName,
    options.ogUrl,
    options.twitterCard,
    options.twitterTitle,
    options.twitterDescription,
    options.twitterImage,
    options.twitterCreator,
    options.canonical,
    options.lang,
    options.robots,
    options.author,
    options.publishedTime,
    options.modifiedTime
  ]);
};

export default useMetaTags;
