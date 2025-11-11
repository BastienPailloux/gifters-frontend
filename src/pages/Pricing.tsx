import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Title, Subtitle } from '../components/common/typography';
import { CallToAction } from '../components/common/cta';
import { SEO } from '../components/common/seo';
import { PricingPlans, PricingFAQ } from '../components/pricing';
import { PricingPlan } from '../types';

const Pricing: React.FC = () => {
  const { t } = useTranslation('marketing');
  const navigate = useNavigate();

  // Plans tarifaires
  const pricingPlans: PricingPlan[] = [
    {
      id: 'free',
      name: t('marketing:pricing.plans.free.name'),
      price: 0,
      period: t('marketing:pricing.plans.period.month'),
      description: t('marketing:pricing.plans.free.description'),
      features: [
        { name: t('marketing:pricing.features.wishLists'), included: true },
        { name: t('marketing:pricing.features.groups', { count: 2 }), included: true },
        { name: t('marketing:pricing.features.members', { count: 10 }), included: true },
        { name: t('marketing:pricing.features.giftIdeas', { count: 20 }), included: true },
        { name: t('marketing:pricing.features.support'), included: false },
        { name: t('marketing:pricing.features.noAds'), included: false }
      ],
      ctaText: t('marketing:pricing.plans.free.cta'),
      popular: true,
      popularText: t('marketing:pricing.temporarilyFree', 'Promotion temporaire')
    },
    {
      id: 'standard',
      name: t('marketing:pricing.plans.standard.name'),
      price: 4.99,
      period: t('marketing:pricing.plans.period.month'),
      description: t('marketing:pricing.plans.standard.description'),
      features: [
        { name: t('marketing:pricing.features.wishLists'), included: true },
        { name: t('marketing:pricing.features.groups', { count: 5 }), included: true },
        { name: t('marketing:pricing.features.members', { count: 30 }), included: true },
        { name: t('marketing:pricing.features.giftIdeas', { count: 100 }), included: true },
        { name: t('marketing:pricing.features.support'), included: true },
        { name: t('marketing:pricing.features.noAds'), included: true }
      ],
      ctaText: t('marketing:pricing.comingSoon', 'Bientôt disponible'),
      disabled: true
    },
    {
      id: 'premium',
      name: t('marketing:pricing.plans.premium.name'),
      price: 9.99,
      period: t('marketing:pricing.plans.period.month'),
      description: t('marketing:pricing.plans.premium.description'),
      features: [
        { name: t('marketing:pricing.features.wishLists'), included: true },
        { name: t('marketing:pricing.features.groups', { count: "unlimited" as unknown as number }), included: true },
        { name: t('marketing:pricing.features.members', { count: "unlimited" as unknown as number }), included: true },
        { name: t('marketing:pricing.features.giftIdeas', { count: "unlimited" as unknown as number }), included: true },
        { name: t('marketing:pricing.features.support'), included: true },
        { name: t('marketing:pricing.features.noAds'), included: true }
      ],
      ctaText: t('pricing.comingSoon', 'Bientôt disponible'),
      disabled: true
    }
  ];

  const handlePlanSelect = (planId: string) => {
    navigate('/register', { state: { selectedPlan: planId } });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <SEO
        translationKey="pricing"
        title={t('marketing:pricing.title', 'Tarifs | Gifters')}
        description={t('marketing:pricing.description', 'Découvrez nos différentes formules tarifaires pour Gifters - gratuites et premium.')}
        keywords={t('marketing:pricing.keywords', 'tarifs, abonnement, gratuit, premium, gifters').split(',')}
        type="website"
      />

      <div className="text-center mb-16">
        <Title as="h1" centered animated>
          {t('marketing:pricing.title')}
        </Title>
        <Subtitle centered animated maxWidth="2xl">
          {t('marketing:pricing.subtitle')}
        </Subtitle>
      </div>

      <PricingPlans
        plans={pricingPlans}
        onPlanSelect={handlePlanSelect}
        className="mb-16"
        freeText={t('marketing:pricing.free')}
        popularText={t('marketing:pricing.mostPopular')}
      />

      <div className="bg-primary-50 rounded-lg p-8 my-16">
        <CallToAction
          message={t('marketing:pricing.specialOffer')}
          buttonText={t('marketing:pricing.contactUs')}
          buttonProps={{
            onClick: () => navigate('/contact'),
            variant: 'secondary'
          }}
          className="bg-transparent"
          animated
        />
      </div>

      <PricingFAQ className="my-16" />
    </div>
  );
};

export default Pricing;
