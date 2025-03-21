import React from 'react';
import { motion, Variants } from 'framer-motion';
import AboutCard from './AboutCard';

interface AboutCardItem {
  title: string;
  paragraphs: string[];
}

interface AboutCardGridProps {
  items: AboutCardItem[];
  className?: string;
  containerVariants?: Variants;
  itemVariants?: Variants;
}

const AboutCardGrid: React.FC<AboutCardGridProps> = ({
  items,
  className = '',
  containerVariants,
  itemVariants
}) => {
  // Variants par défaut si non fournis
  const defaultContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const defaultItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${className}`}
      variants={containerVariants || defaultContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <AboutCard
          key={index}
          title={item.title}
          paragraphs={item.paragraphs}
          variants={itemVariants || defaultItemVariants}
        />
      ))}
    </motion.div>
  );
};

export default AboutCardGrid;
