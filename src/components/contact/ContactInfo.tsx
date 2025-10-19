import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Title } from '../common/typography';
import { ContactInfoProps, ContactInfoItem } from '../../types';

const ContactInfo: React.FC<ContactInfoProps> = ({ className, items, title, description }) => {
  const { t } = useTranslation('contact');

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

  // Default items if none provided
  const defaultItems: ContactInfoItem[] = [
    {
      id: 1,
      icon: <FaEnvelope className="text-primary mt-1 text-xl" />,
      title: t('contact:email'),
      content: 'contact@gifters.fr'
    }
  ];

  const contactItems = items || defaultItems;

  return (
    <div className={className}>
      <Title as="h3">{title || t('contact:infoTitle')}</Title>

      {description && (
        <p className="text-gray-600 mt-2">{description}</p>
      )}

      <motion.div
        className="space-y-6 mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {contactItems.map((item) => (
          <motion.div
            key={item.id}
            className="flex items-start space-x-4"
            variants={itemVariants}
          >
            {item.icon}
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-600">{item.content}</p>
              {item.link && (
                <a href={item.link} className="text-primary-600 hover:underline block mt-1">
                  {t('common:visitLink')}
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ContactInfo;
