import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Title, Subtitle } from '../components/common/typography';
import { CallToAction } from '../components/common/cta';
import Card from '../components/common/display/Card';
import { SEO } from '../components/common/seo';
import PricingFAQ from '../components/pricing/PricingFAQ';

// Types pour les plans tarifaires
interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PricingFeature[];
  ctaText: string;
  popular?: boolean;
}

const Pricing: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Plans tarifaires
  const pricingPlans: PricingPlan[] = [
    {
      id: 'free',
      name: t('pricing.plans.free.name'),
      price: 0,
      period: t('pricing.plans.period.month'),
      description: t('pricing.plans.free.description'),
      features: [
        { name: t('pricing.features.wishLists'), included: true },
        { name: t('pricing.features.groups', { count: 2 }), included: true },
        { name: t('pricing.features.members', { count: 10 }), included: true },
        { name: t('pricing.features.giftIdeas', { count: 20 }), included: true },
        { name: t('pricing.features.support'), included: false },
        { name: t('pricing.features.noAds'), included: false }
      ],
      ctaText: t('pricing.plans.free.cta')
    },
    {
      id: 'standard',
      name: t('pricing.plans.standard.name'),
      price: 4.99,
      period: t('pricing.plans.period.month'),
      description: t('pricing.plans.standard.description'),
      features: [
        { name: t('pricing.features.wishLists'), included: true },
        { name: t('pricing.features.groups', { count: 5 }), included: true },
        { name: t('pricing.features.members', { count: 30 }), included: true },
        { name: t('pricing.features.giftIdeas', { count: 100 }), included: true },
        { name: t('pricing.features.support'), included: true },
        { name: t('pricing.features.noAds'), included: true }
      ],
      ctaText: t('pricing.plans.standard.cta'),
      popular: true
    },
    {
      id: 'premium',
      name: t('pricing.plans.premium.name'),
      price: 9.99,
      period: t('pricing.plans.period.month'),
      description: t('pricing.plans.premium.description'),
      features: [
        { name: t('pricing.features.wishLists'), included: true },
        { name: t('pricing.features.groups', { count: "unlimited" as unknown as number }), included: true },
        { name: t('pricing.features.members', { count: "unlimited" as unknown as number }), included: true },
        { name: t('pricing.features.giftIdeas', { count: "unlimited" as unknown as number }), included: true },
        { name: t('pricing.features.support'), included: true },
        { name: t('pricing.features.noAds'), included: true }
      ],
      ctaText: t('pricing.plans.premium.cta')
    }
  ];

  const handlePlanSelect = (planId: string) => {
    navigate('/register', { state: { selectedPlan: planId } });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <SEO
        translationKey="pricing.seo"
        title={t('pricing.seo.title', 'Tarifs | Gifters')}
        description={t('pricing.seo.description', 'Découvrez nos différentes formules tarifaires pour Gifters - gratuites et premium.')}
        keywords={t('pricing.seo.keywords', 'tarifs, abonnement, gratuit, premium, gifters').split(',')}
        type="website"
      />

      <div className="text-center mb-16">
        <Title as="h1" centered animated>
          {t('pricing.title')}
        </Title>
        <Subtitle centered animated maxWidth="2xl">
          {t('pricing.subtitle')}
        </Subtitle>
      </div>

      <motion.div
        className="flex flex-col lg:flex-row gap-8 justify-center mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {pricingPlans.map((plan) => (
          <motion.div
            key={plan.id}
            className={`flex-1 max-w-md mx-auto ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
            variants={itemVariants}
          >
            <Card
              className={`h-full ${plan.popular ? 'border-primary-500 shadow-lg' : ''}`}
            >
              <div className="p-6 flex flex-col h-full">
                {plan.popular && (
                  <div className="bg-primary-500 text-white text-center py-1 px-4 rounded-full text-sm font-medium mb-4 self-start">
                    {t('pricing.mostPopular')}
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price === 0 ? t('pricing.free') : `${plan.price}€`}</span>
                  {plan.price > 0 && <span className="text-gray-500">/{plan.period}</span>}
                </div>

                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="border-t border-gray-200 pt-4 mb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        {feature.included ? (
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className={feature.included ? 'text-gray-800' : 'text-gray-500'}>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-2 px-4 rounded-md transition-colors ${
                      plan.popular
                        ? 'bg-primary-500 hover:bg-primary-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="bg-primary-50 rounded-lg p-8 my-16">
        <CallToAction
          message={t('pricing.specialOffer')}
          buttonText={t('pricing.contactUs')}
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
