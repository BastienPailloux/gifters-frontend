import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { Title, Subtitle } from '../components/common/typography';
import { CallToAction } from '../components/common/cta';
import { DetailedFeaturesSection } from '../components/features';
import FeaturesGrid from '../components/features/FeaturesGrid';
import { FeatureCardProps, DetailedFeature } from '../types';
import { SEO } from '../components/common/seo';

const Features: React.FC = () => {
  const { t } = useTranslation('marketing');
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <SEO
        translationKey="features"
        title={t('marketing:features.title', 'Fonctionnalités | Gifters')}
        description={t('marketing:features.description', 'Découvrez toutes les fonctionnalités de Gifters : listes de souhaits, groupes, tirage au sort et plus encore.')}
        keywords={t('marketing:features.keywords', 'fonctionnalités, listes de souhaits, groupes, tirage au sort, partage, cadeaux').split(',')}
        image="/images/features/features-cover.jpg"
        type="website"
      />

      <div className="text-center mb-12">
        <Title as="h1" centered animated>
          {t('marketing:features.title')}
        </Title>
        <Subtitle centered animated maxWidth="2xl">
          {t('marketing:features.subtitle')}
        </Subtitle>
      </div>

      <FeaturesGrid features={getFeatures(t)} className="mb-16" />

      <CallToAction
        message={t('marketing:features.cta')}
        buttonText={t('marketing:features.register')}
        buttonProps={{
          onClick: () => navigate('/register')
        }}
        className="mt-12 mb-20"
        animated
      />

      <DetailedFeaturesSection
        sectionTitle={t('marketing:features.detailedTitle')}
        features={getDetailedFeatures(t)}
        animated
      />

      <div className="bg-primary-50 rounded-lg p-8 mt-20">
        <CallToAction
          message={t('marketing:features.finalCta')}
          buttonText={t('marketing:features.startNow')}
          buttonProps={{
            onClick: () => navigate('/register'),
            variant: 'secondary'
          }}
          className="bg-transparent"
          animated
        />
      </div>
    </div>
  );
};

// Fonction pour obtenir les features (déplacée en dehors du composant pour éviter les re-renders inutiles)
const getFeatures = (t: TFunction): Omit<FeatureCardProps, 'delay'>[] => [
  {
    title: t('marketing:features.wishLists.title'),
    description: t('marketing:features.wishLists.description'),
    icon: 'gift' as const
  },
  {
    title: t('marketing:features.groups.title'),
    description: t('marketing:features.groups.description'),
    icon: 'users' as const
  },
  {
    title: t('marketing:features.events.title'),
    description: t('marketing:features.events.description'),
    icon: 'calendar' as const
  },
  {
    title: t('marketing:features.notifications.title'),
    description: t('marketing:features.notifications.description'),
    icon: 'bell' as const
  },
  {
    title: t('marketing:features.privacy.title'),
    description: t('marketing:features.privacy.description'),
    icon: 'shield' as const
  },
  {
    title: t('marketing:features.multiLanguage.title'),
    description: t('marketing:features.multiLanguage.description'),
    icon: 'globe' as const
  }
];

// Fonction pour obtenir les detailed features
const getDetailedFeatures = (t: TFunction): DetailedFeature[] => [
  {
    id: 'wishlists',
    title: t('marketing:features.wishLists.title'),
    description: t('marketing:features.wishLists.detailedDescription'),
    imageSrc: '/images/features/wishlist-detail.svg',
    imageAlt: t('marketing:features.wishLists.imageAlt')
  },
  {
    id: 'groups',
    title: t('marketing:features.groups.title'),
    description: t('marketing:features.groups.detailedDescription'),
    imageSrc: '/images/features/groups-detail.svg',
    imageAlt: t('marketing:features.groups.imageAlt')
  },
  {
    id: 'events',
    title: t('marketing:features.events.title'),
    description: t('marketing:features.events.detailedDescription'),
    imageSrc: '/images/features/events-detail.svg',
    imageAlt: t('marketing:features.events.imageAlt')
  }
];

export default Features;
