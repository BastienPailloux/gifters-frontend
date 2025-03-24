import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { DetailedFeaturesSectionProps } from '../../types';
import DetailedFeature from './DetailedFeature';
import { Title } from '../common/typography';

const DetailedFeaturesSection: React.FC<DetailedFeaturesSectionProps> = ({
  sectionTitle,
  features,
  className = '',
  animated = false,
}) => {
  return (
    <section className={twMerge('relative w-full py-16', className)}>
      <div className="container mx-auto px-4">
        {sectionTitle && (
          <motion.div
            initial={animated ? { opacity: 0, y: -20 } : undefined}
            animate={animated ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Title as="h2" centered>{sectionTitle}</Title>
          </motion.div>
        )}

        <div className="space-y-24">
          {features.map((feature, index) => (
            <DetailedFeature
              key={feature.id}
              {...feature}
              reversed={index % 2 !== 0}
              animated={animated}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedFeaturesSection;
