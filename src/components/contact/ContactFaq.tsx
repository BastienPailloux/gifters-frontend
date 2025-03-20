import React from 'react';
import { useTranslation } from 'react-i18next';
import { Faq, FaqItem } from '../common/faq';

interface ContactFaqProps {
  className?: string;
}

const ContactFaq: React.FC<ContactFaqProps> = ({ className }) => {
  const { t } = useTranslation();

  // FAQ items
  const faqItems: FaqItem[] = [
    {
      question: t('contact.faq.question1'),
      answer: t('contact.faq.answer1')
    },
    {
      question: t('contact.faq.question2'),
      answer: t('contact.faq.answer2')
    },
    {
      question: t('contact.faq.question3'),
      answer: t('contact.faq.answer3')
    },
    {
      question: t('contact.faq.question4'),
      answer: t('contact.faq.answer4')
    }
  ];

  // Alternative: utiliser des clés de traduction automatiques
  // const faqItems: FaqItem[] = Array.from({ length: 4 }, (_, i) => ({
  //   question: '',
  //   answer: '',
  //   translationKey: `contact.faq.item${i + 1}`
  // }));

  return (
    <Faq
      items={faqItems}
      titleTranslationKey="contact.faqTitle"
      className={className}
      // Ou utiliser le préfixe de traduction
      // translationPrefix="contact.faq"
    />
  );
};

export default ContactFaq;
