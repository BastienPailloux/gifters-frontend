import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export interface TitleProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  animated?: boolean;
  delay?: number;
}

const Title: React.FC<TitleProps> = ({
  children,
  className = '',
  centered = false,
  as: Component = 'h1',
  animated = false,
  delay = 0,
}) => {
  const baseStyles = twMerge(
    'font-extrabold text-gray-900',
    Component === 'h1' && 'text-4xl sm:text-5xl sm:tracking-tight lg:text-6xl',
    Component === 'h2' && 'text-3xl sm:text-4xl',
    Component === 'h3' && 'text-2xl sm:text-3xl',
    Component === 'h4' && 'text-xl sm:text-2xl',
    Component === 'h5' && 'text-lg sm:text-xl',
    Component === 'h6' && 'text-base sm:text-lg',
    centered && 'text-center mx-auto',
    className
  );

  if (animated) {
    return (
      <motion.div
        className={baseStyles}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        {Component === 'h1' ? (
          <h1>{children}</h1>
        ) : Component === 'h2' ? (
          <h2>{children}</h2>
        ) : Component === 'h3' ? (
          <h3>{children}</h3>
        ) : Component === 'h4' ? (
          <h4>{children}</h4>
        ) : Component === 'h5' ? (
          <h5>{children}</h5>
        ) : (
          <h6>{children}</h6>
        )}
      </motion.div>
    );
  }

  return <Component className={baseStyles}>{children}</Component>;
};

export default Title;
