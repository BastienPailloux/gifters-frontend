import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Faq } from '../common/faq';
import { FaqItem } from '../../types';
import { PricingFAQProps } from '../../types/pricing';

const PricingFAQ: React.FC<PricingFAQProps> = ({ className = '' }) => {
  const { t } = useTranslation('marketing');

  const pricingFaqItems: FaqItem[] = [
    {
      id: 'pricing-faq-1',
      question: t('pricing.faq.q1'),
      answer: t('pricing.faq.a1')
    },
    {
      id: 'pricing-faq-2',
      question: t('pricing.faq.q2'),
      answer: t('pricing.faq.a2')
    },
    {
      id: 'pricing-faq-3',
      question: t('pricing.faq.q3'),
      answer: t('pricing.faq.a3')
    },
    {
      id: 'pricing-faq-4',
      question: t('pricing.faq.q4'),
      answer: t('pricing.faq.a4')
    }
  ];

  return (
    <motion.div
      className={`max-w-3xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Faq
        title={t('pricing.faq.title')}
        items={pricingFaqItems}
        className="bg-white rounded-lg shadow-md overflow-hidden"
        itemClassName="border-b border-gray-200 last:border-b-0"
      />
    </motion.div>
  );
};

export default PricingFAQ;
