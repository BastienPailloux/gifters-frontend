import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { Title, Subtitle } from '../components/common/typography';
import { ContactForm, ContactInfo, ContactFaq } from '../components/contact';

const Contact: React.FC = () => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Title>{t('contact.title')}</Title>
      <Subtitle className="mb-12">{t('contact.subtitle')}</Subtitle>

      <div className="flex flex-col md:flex-row gap-12 mb-16">
        {/* Contact Form */}
        <motion.div
          className="flex-1 bg-white rounded-lg shadow-md p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <ContactForm />
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="flex-1 bg-white rounded-lg shadow-md p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <ContactInfo />
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-6 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ContactFaq />
      </motion.div>
    </div>
  );
};

export default Contact;
