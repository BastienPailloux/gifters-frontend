import React from 'react';
import { motion } from 'framer-motion';
import PricingCard from './PricingCard';
import { PricingPlansProps } from '../../types';

const PricingPlans: React.FC<PricingPlansProps> = ({
  plans,
  onPlanSelect,
  className = '',
  freeText,
  popularText
}) => {
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

  // Ajout des textes traduits aux plans
  const plansWithTexts = plans.map(plan => ({
    ...plan,
    freeText,
    popularText
  }));

  return (
    <motion.div
      className={`flex flex-col lg:flex-row gap-8 justify-center ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {plansWithTexts.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          onSelect={onPlanSelect}
          itemVariants={itemVariants}
        />
      ))}
    </motion.div>
  );
};

export default PricingPlans;
