/**
 * Types pour les fonctionnalités SEO
 */

/**
 * Options pour le hook useMetaTags qui injecte directement les métadonnées dans le DOM
 */
export interface MetaTagsOptions {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogSiteName?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCreator?: string;
  canonical?: string;
  lang?: string;
  robots?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Props pour le composant SEO
 */
export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  twitterUsername?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonicalUrl?: string;
  translationKey?: string;
}
