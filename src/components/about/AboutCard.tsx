import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/display/Card';
import { Title } from '../common/typography';
import { AboutCardProps } from '../../types/about';

const AboutCard: React.FC<AboutCardProps> = ({
  title,
  paragraphs,
  className = '',
  variants
}) => {
  return (
    <motion.div variants={variants}>
      <Card className={`h-full ${className}`}>
        <div className="p-6">
          <Title as="h2" className="mb-6">
            {title}
          </Title>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-gray-700 ${index < paragraphs.length - 1 ? 'mb-4' : ''}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default AboutCard;
