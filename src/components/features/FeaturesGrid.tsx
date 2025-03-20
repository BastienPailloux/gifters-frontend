import React from 'react';
import { twMerge } from 'tailwind-merge';
import FeatureCard, { FeatureCardProps } from './FeatureCard';

export interface FeaturesGridProps {
  features: Omit<FeatureCardProps, 'delay'>[];
  className?: string;
}

const FeaturesGrid: React.FC<FeaturesGridProps> = ({ features, className }) => {
  return (
    <div className={twMerge(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      className
    )}>
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          {...feature}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default FeaturesGrid;
