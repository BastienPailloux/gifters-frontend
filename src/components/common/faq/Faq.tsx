import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Title } from '../typography';
import Card from '../display/Card';
import { FaqItem, FaqProps } from '../../../types';

const Faq: React.FC<FaqProps> = ({
  items,
  title,
  className = '',
  description,
}) => {
  const { t } = useTranslation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  return (
    <Card className={className}>
      {title && (
        <Title as="h2" className="mb-6">
          {title}
        </Title>
      )}

      {description && (
        <p className="text-gray-600 mb-6">{description}</p>
      )}

      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id || index}
            className="border-b border-gray-200 pb-4 last:border-0"
            variants={itemVariants}
          >
            <h3 className="font-semibold text-lg mb-2">
              {item.question}
            </h3>
            <div className="text-gray-600">
              {item.answer}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};

export default Faq;
