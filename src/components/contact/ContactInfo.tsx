import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Title } from '../common/typography';

interface ContactInfoProps {
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ className }) => {
  const { t } = useTranslation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <div className={className}>
      <Title as="h3">{t('contact.infoTitle')}</Title>

      <motion.div className="space-y-6 mt-6" variants={containerVariants}>
        <motion.div className="flex items-start space-x-4" variants={itemVariants}>
          <FaEnvelope className="text-primary mt-1 text-xl" />
          <div>
            <h3 className="font-semibold">{t('contact.email')}</h3>
            <p className="text-gray-600">contact@gifters.fr</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactInfo;
