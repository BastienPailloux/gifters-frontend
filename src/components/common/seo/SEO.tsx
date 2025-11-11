import React from 'react';
import { useTranslation } from 'react-i18next';
import useMetaTags from '../../../hooks/useMetaTags';
import { SEOProps } from '../../../types/seo';

/**
 * Composant SEO qui utilise le hook useMetaTags pour mettre à jour les métadonnées de la page
 */
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
}) => {
  const { t, i18n } = useTranslation(['seo']);
  const currentLanguage = i18n.language;
  const siteName = 'Gifters';
  const defaultUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Si une clé de traduction est fournie, utiliser les traductions
  const pageTitle = translationKey
    ? t(`seo:${translationKey}.title`, '')
    : title || 'Gifters'; // Valeur par défaut si ni title ni translationKey n'est fourni

  const pageDescription = translationKey && !description
    ? t(`seo:${translationKey}.description`, '')
    : description || '';

  const pageKeywords = translationKey && !keywords
    ? t(`seo:${translationKey}.keywords`, '').split(',').map(k => k.trim()).filter(Boolean)
    : keywords || [];

  // Construction du titre complet
  const fullTitle = pageTitle.includes(siteName)
    ? pageTitle
    : `${pageTitle} | ${siteName}`;

  // Construction des metas robots
  const robotsContent = [];
  if (noIndex) robotsContent.push('noindex');
  if (noFollow) robotsContent.push('nofollow');
  const robots = robotsContent.length > 0 ? robotsContent.join(', ') : 'index, follow';

  // Utiliser notre hook personnalisé pour mettre à jour les métadonnées
  useMetaTags({
    title: fullTitle,
    description: pageDescription,
    keywords: pageKeywords,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogImage: image || '/images/features/features-cover.jpg',
    ogType: type,
    ogSiteName: siteName,
    ogUrl: url || defaultUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    twitterImage: image || '/images/features/features-cover.jpg',
    twitterCreator: twitterUsername,
    canonical: canonicalUrl || defaultUrl,
    lang: currentLanguage,
    robots: robots,
    author: author,
    publishedTime: publishedTime,
    modifiedTime: modifiedTime
  });

  // Ce composant ne rend rien visuellement
  return null;
};

export default SEO;
