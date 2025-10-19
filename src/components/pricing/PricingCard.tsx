import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/display/Card';
import Button from '../common/forms/Button';
import ColorTag from '../common/display/ColorTag';
import Title from '../common/typography/Title';
import { PricingCardProps, PricingFeature } from '../../types';
import { useTranslation } from 'react-i18next';

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  onSelect,
  itemVariants,
}) => {
  const { t } = useTranslation('marketing');

  return (
    <motion.div
      className={`flex-1 max-w-md mx-auto ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
      variants={itemVariants}
    >
      <Card
        className={`h-full ${plan.popular ? 'border-primary-500 shadow-lg' : ''} ${plan.disabled ? 'opacity-70' : ''}`}
      >
        <div className="p-6 flex flex-col h-full">
          {plan.popular && (
            <ColorTag
              text={plan.popularText || 'Popular'}
              color="blue"
              className="mb-4 self-start"
            />
          )}

          {plan.disabled && (
            <ColorTag
              text={plan.ctaText}
              color="gray"
              className="mb-4 self-start"
            />
          )}

          <Title as="h3" className="text-2xl font-bold mb-2">{plan.name}</Title>
          <div className="mb-4">
            <span className="text-4xl font-bold">{plan.price === 0 ? plan.freeText : `${plan.price}€`}</span>
            {plan.price > 0 && <span className="text-gray-500">/{plan.period}</span>}
          </div>

          <p className="text-gray-600 mb-6">{plan.description}</p>

          <div className="border-t border-gray-200 pt-4 mb-8">
            <ul className="space-y-3">
              {plan.features.map((feature: PricingFeature, index: number) => (
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
            <Button
              onClick={() => !plan.disabled && onSelect(plan.id)}
              variant={plan.popular ? 'primary' : 'ghost'}
              fullWidth
              disabled={plan.disabled}
            >
              {plan.ctaText}
            </Button>

            {plan.id === 'free' && (
              <p className="text-center text-sm text-red-600 font-medium mt-3">
                {t('pricing.temporarilyUnlimited', 'Toutes les fonctionnalités sont temporairement illimitées !')}
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PricingCard;
