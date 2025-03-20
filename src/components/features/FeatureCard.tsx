import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { FeatureCardProps } from '../../types';
import Button from '../common/forms/Button';
import FeatureIcon from './FeatureIcon';

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  buttonText,
  buttonProps,
  delay = 0,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={twMerge(
        'flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300',
        className
      )}
    >
      <div className="mb-4">
        <FeatureIcon icon={icon} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      {buttonText && (
        <Button
          variant="primary"
          size="md"
          fullWidth
          {...buttonProps}
        >
          {buttonText}
        </Button>
      )}
    </motion.div>
  );
};

export default FeatureCard;
