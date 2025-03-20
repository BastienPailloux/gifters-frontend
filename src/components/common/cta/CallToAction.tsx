import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import Button from '../forms/Button';
import { ButtonProps } from '../../../types';

export interface CallToActionProps {
  message?: string;
  buttonText: string;
  buttonProps?: Omit<ButtonProps, 'children'>;
  className?: string;
  delay?: number;
  animated?: boolean;
}

const CallToAction: React.FC<CallToActionProps> = ({
  message,
  buttonText,
  buttonProps,
  className = '',
  delay = 0.8,
  animated = false,
}) => {
  const content = (
    <div className={twMerge('text-center', className)}>
      {message && <p className="text-lg text-gray-600 mb-6">{message}</p>}
      <Button
        variant="primary"
        size="lg"
        {...buttonProps}
        className={twMerge('mx-auto', buttonProps?.className)}
      >
        {buttonText}
      </Button>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default CallToAction;
