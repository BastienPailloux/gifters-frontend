import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Title, Subtitle } from '../common/typography';

export interface DetailedFeatureProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  className?: string;
  animated?: boolean;
}

const DetailedFeature: React.FC<DetailedFeatureProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
  className = '',
  animated = false,
}) => {
  const content = (
    <div className={twMerge(
      'flex flex-col md:flex-row items-center gap-8 md:gap-16 py-8',
      reverse && 'md:flex-row-reverse',
      className
    )}>
      {/* Text content */}
      <div className="w-full md:w-1/2 space-y-6">
        <Title as="h3" animated={animated} delay={0.2} className="text-primary-800">
          {title}
        </Title>
        <Subtitle
          animated={animated}
          delay={0.3}
          maxWidth="none"
          className="text-gray-700 leading-relaxed text-lg"
        >
          {description}
        </Subtitle>
      </div>

      {/* Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full max-w-md h-auto object-contain rounded-lg shadow-lg"
          style={{
            maxHeight: '400px',
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}
        />
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default DetailedFeature;
