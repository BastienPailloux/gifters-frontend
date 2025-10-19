import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Faq } from '../common/faq';
import { ContactFaqProps, FaqItem } from '../../types';

const ContactFaq: React.FC<ContactFaqProps> = ({ className, faqs, title, description }) => {
  const { t } = useTranslation('contact');

  // FAQ items (utilisés uniquement si aucune donnée n'est passée via props)
  const defaultFaqItems: FaqItem[] = [
    {
      id: 'contact-faq-1',
      question: t('contact:faq.question1'),
      answer: t('contact:faq.answer1')
    },
    {
      id: 'contact-faq-2',
      question: t('contact:faq.question2'),
      answer: t('contact:faq.answer2')
    },
    {
      id: 'contact-faq-3',
      question: t('contact:faq.question3'),
      answer: t('contact:faq.answer3')
    },
    {
      id: 'contact-faq-4',
      question: t('contact:faq.question4'),
      answer: t('contact:faq.answer4')
    }
  ];

  return (
    <motion.div className="max-w-3xl mx-auto">
      <Faq
        items={faqs || defaultFaqItems}
        title={title || t('contact:faqTitle')}
        description={description}
        className={`bg-white rounded-lg shadow-md overflow-hidden ${className || ''}`}
        itemClassName="border-b border-gray-200 last:border-b-0"
      />
    </motion.div>
  );
};

export default ContactFaq;
