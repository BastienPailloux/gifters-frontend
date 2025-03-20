import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Title } from '../typography';
import Card from '../display/Card';
import FaqAccordion from './FaqAccordion';
import { FaqProps } from '../../../types';

const Faq: React.FC<FaqProps> = ({
  items,
  title,
  className = '',
  description,
  itemClassName = '',
}) => {
  const [openItems, setOpenItems] = useState<Record<string | number, boolean>>({});

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

  const toggleAccordion = (id: string | number) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      {title && (
        <Title as="h2" centered className="mb-6">
          {title}
        </Title>
      )}

      <Card className={className}>
        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}

        <motion.div
          className="divide-y divide-gray-200"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item, index) => {
            const id = item.id || index;
            return (
              <motion.div
                key={id}
                variants={itemVariants}
              >
                <FaqAccordion
                  faqItem={item}
                  isOpen={!!openItems[id]}
                  toggleAccordion={() => toggleAccordion(id)}
                  className={itemClassName}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </Card>
    </div>
  );
};

export default Faq;
