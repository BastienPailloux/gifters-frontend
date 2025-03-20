import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export interface SubtitleProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
  animated?: boolean;
  delay?: number;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none';
}

const Subtitle: React.FC<SubtitleProps> = ({
  children,
  className = '',
  centered = false,
  animated = false,
  delay = 0.2,
  maxWidth = '2xl',
}) => {
  const baseStyles = twMerge(
    'text-xl text-gray-600',
    centered && 'text-center mx-auto',
    maxWidth !== 'none' && `max-w-${maxWidth}`,
    className
  );

  if (animated) {
    return (
      <motion.p
        className={baseStyles}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.p>
    );
  }

  return <p className={baseStyles}>{children}</p>;
};

export default Subtitle;
