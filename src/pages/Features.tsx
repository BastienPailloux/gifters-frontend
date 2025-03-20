import React from 'react';
import { useTranslation } from 'react-i18next';
import { Title, Subtitle } from '../components/common/typography';
import { CallToAction } from '../components/common/cta';
import FeaturesGrid from '../components/features/FeaturesGrid';
import { FeatureCardProps } from '../components/features/FeatureCard';

const Features: React.FC = () => {
  const { t } = useTranslation();

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

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
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
          onClick: () => window.location.href = '/register'
        }}
        className="mt-12"
        animated
      />
    </div>
  );
};

export default Features;
