import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Button from '../components/common/forms/Button';
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
        <motion.h1
          className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('features.title')}
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t('features.subtitle')}
        </motion.p>
      </div>
      <FeaturesGrid features={features} className="mb-16" />

      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-lg text-gray-600 mb-6">{t('features.cta')}</p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => window.location.href = '/register'}
          className="mx-auto"
        >
          {t('features.register')}
        </Button>
      </motion.div>
    </div>
  );
};

export default Features;
