import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Title, Subtitle } from '../components/common/typography';
import { CallToAction } from '../components/common/cta';
import { DetailedFeaturesSection } from '../components/features';
import FeaturesGrid from '../components/features/FeaturesGrid';
import { FeatureCardProps } from '../types';
import { SEO } from '../components/common/seo';

const Features: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features: Omit<FeatureCardProps, 'delay'>[] = [
    {
      title: t('features.wishLists.title'),
      description: t('features.wishLists.description'),
      icon: 'gift' as const
    },
    {
      title: t('features.groups.title'),
      description: t('features.groups.description'),
      icon: 'users' as const
    },
    {
      title: t('features.events.title'),
      description: t('features.events.description'),
      icon: 'calendar' as const
    },
    {
      title: t('features.notifications.title'),
      description: t('features.notifications.description'),
      icon: 'bell' as const
    },
    {
      title: t('features.privacy.title'),
      description: t('features.privacy.description'),
      icon: 'shield' as const
    },
    {
      title: t('features.multiLanguage.title'),
      description: t('features.multiLanguage.description'),
      icon: 'globe' as const
    }
  ];

  const detailedFeatures = [
    {
      id: 'wishlists',
      title: t('features.wishLists.title'),
      description: t('features.wishLists.detailedDescription'),
      imageSrc: '/images/features/wishlist-detail.svg',
      imageAlt: t('features.wishLists.imageAlt')
    },
    {
      id: 'groups',
      title: t('features.groups.title'),
      description: t('features.groups.detailedDescription'),
      imageSrc: '/images/features/groups-detail.svg',
      imageAlt: t('features.groups.imageAlt')
    },
    {
      id: 'events',
      title: t('features.events.title'),
      description: t('features.events.detailedDescription'),
      imageSrc: '/images/features/events-detail.svg',
      imageAlt: t('features.events.imageAlt')
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <SEO translationKey="seo.features" />

      <div className="text-center mb-12">
        <Title as="h1" centered animated>
          {t('features.title')}
        </Title>
        <Subtitle centered animated maxWidth="2xl">
          {t('features.subtitle')}
        </Subtitle>
      </div>
      <FeaturesGrid features={features} className="mb-16" />

      <CallToAction
        message={t('features.cta')}
        buttonText={t('features.register')}
        buttonProps={{
          onClick: () => navigate('/register')
        }}
        className="mt-12 mb-20"
        animated
      />

      <DetailedFeaturesSection
        sectionTitle={t('features.detailedTitle')}
        features={detailedFeatures}
        animated
      />

      <div className="bg-primary-50 rounded-lg p-8 mt-20">
        <CallToAction
          message={t('features.finalCta')}
          buttonText={t('features.startNow')}
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

export default Features;
