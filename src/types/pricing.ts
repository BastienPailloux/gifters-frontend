/**
 * Types pour les composants de tarification
 */

import { Variant } from 'framer-motion';

/**
 * Interface pour une fonctionnalité d'un plan tarifaire
 */
export interface PricingFeature {
  name: string;
  included: boolean;
}

/**
 * Interface pour un plan tarifaire
 */
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PricingFeature[];
  ctaText: string;
  popular?: boolean;
  popularText?: string;
  freeText?: string;
  disabled?: boolean;
}

/**
 * Props pour le composant PricingCard
 */
export interface PricingCardProps {
  plan: PricingPlan;
  onSelect: (planId: string) => void;
  itemVariants?: Record<string, Variant>;
}

/**
 * Props pour le composant PricingPlans
 */
export interface PricingPlansProps {
  plans: PricingPlan[];
  onPlanSelect: (planId: string) => void;
  className?: string;
  freeText: string;
  popularText: string;
}

/**
 * Propriétés pour le composant PricingFAQ
 */
export interface PricingFAQProps {
  className?: string;
}
