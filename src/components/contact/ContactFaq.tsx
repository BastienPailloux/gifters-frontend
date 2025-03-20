import React from 'react';
import { useTranslation } from 'react-i18next';
import { Faq } from '../common/faq';
import { ContactFaqProps, FaqItem } from '../../types';

const ContactFaq: React.FC<ContactFaqProps> = ({ className, faqs, title, description }) => {
  const { t } = useTranslation();

  // FAQ items (utilisés uniquement si aucune donnée n'est passée via props)
  const defaultFaqItems: FaqItem[] = [
    {
      id: 1,
      question: t('contact.faq.question1'),
      answer: t('contact.faq.answer1')
    },
    {
      id: 2,
      question: t('contact.faq.question2'),
      answer: t('contact.faq.answer2')
    },
    {
      id: 3,
      question: t('contact.faq.question3'),
      answer: t('contact.faq.answer3')
    },
    {
      id: 4,
      question: t('contact.faq.question4'),
      answer: t('contact.faq.answer4')
    }
  ];

  return (
    <Faq
      items={faqs || defaultFaqItems}
      title={title || t('contact.faqTitle')}
      description={description}
      className={className}
    />
  );
};

export default ContactFaq;
