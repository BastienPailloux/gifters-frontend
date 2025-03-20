import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button, Input, TextArea } from '../common/forms';
import { Title } from '../common/typography';

interface ContactFormProps {
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler une API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch {
      // Gérer les erreurs ici
      console.error('Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <Title as="h3">{t('contact.formTitle')}</Title>

      {submitted ? (
        <motion.div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('contact.successMessage')}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <Input
              label={t('contact.form.name')}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              label={t('contact.form.email')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              label={t('contact.form.subject')}
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <TextArea
              label={t('contact.form.message')}
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
