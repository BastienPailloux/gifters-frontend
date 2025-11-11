import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';

import { Title, Subtitle } from '../components/common/typography';
import { ContactForm, ContactInfo, ContactFaq } from '../components/contact';
import Card from '../components/common/display/Card';
import { SEO } from '../components/common/seo';
import { ContactInfoItem } from '../types';

const Contact: React.FC = () => {
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

  // Informations de contact
  const contactInfoItems: ContactInfoItem[] = [
    {
      id: 'email',
      icon: <FaEnvelope className="text-primary-500 mt-1 text-xl" />,
      title: t('contact:email'),
      content: 'contact@gifters.fr'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO translationKey="contact" />

      <Title>{t('contact:title')}</Title>
      <Subtitle className="mb-12">{t('contact:subtitle')}</Subtitle>

      <div className="flex flex-col md:flex-row gap-8 mb-16">
        {/* Contact Form */}
        <motion.div
          className="flex-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <ContactForm />
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="flex-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <ContactInfo items={contactInfoItems} />
          </Card>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="my-16">
        <ContactFaq />
      </div>
    </div>
  );
};

export default Contact;
