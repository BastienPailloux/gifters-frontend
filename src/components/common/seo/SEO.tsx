import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export interface SEOProps {
  title?: string; // Optionnel si translationKey est fourni
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
  translationKey?: string; // Si fourni, utilisera cette clé pour les traductions au lieu des valeurs directes
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  twitterUsername,
  publishedTime,
  modifiedTime,
  noIndex = false,
  noFollow = false,
  canonicalUrl,
  translationKey,
  children,
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const siteName = 'Gifters';
  const defaultUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Si une clé de traduction est fournie, utiliser les traductions
  const pageTitle = translationKey
    ? t(`${translationKey}.title`)
    : title || 'Gifters'; // Valeur par défaut si ni title ni translationKey n'est fourni

  const pageDescription = translationKey && !description
    ? t(`${translationKey}.description`)
    : description;

  const pageKeywords = translationKey && !keywords
    ? t(`${translationKey}.keywords`, '').split(',').map(k => k.trim())
    : keywords;

  // Construction du titre complet
  const fullTitle = `${pageTitle} | ${siteName}`;

  // Construction des metas robots
  const robotsContent = [];
  if (noIndex) robotsContent.push('noindex');
  if (noFollow) robotsContent.push('nofollow');
  const robots = robotsContent.length > 0 ? robotsContent.join(', ') : 'index, follow';

  return (
    <Helmet>
      {/* Balises de base */}
      <html lang={currentLanguage} />
      <title>{fullTitle}</title>
      {pageDescription && <meta name="description" content={pageDescription} />}
      {pageKeywords && <meta name="keywords" content={pageKeywords.join(', ')} />}
      <meta name="robots" content={robots} />

      {/* Balises Open Graph */}
      <meta property="og:title" content={pageTitle} />
      {pageDescription && <meta property="og:description" content={pageDescription} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={url || defaultUrl} />
      {image && <meta property="og:image" content={image} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Balises Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {pageDescription && <meta name="twitter:description" content={pageDescription} />}
      {twitterUsername && <meta name="twitter:creator" content={twitterUsername} />}
      {image && <meta name="twitter:image" content={image} />}

      {/* URL Canonique */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Balises d'alternance de langue */}
      <link rel="alternate" hrefLang={currentLanguage} href={url || defaultUrl} />

      {/* Autres balises personnalisées */}
      {children}
    </Helmet>
  );
};

export default SEO;
