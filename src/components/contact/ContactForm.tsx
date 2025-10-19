import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button, Input, TextArea } from '../common/forms';
import { Title } from '../common/typography';
import { ContactFormProps, ContactFormData } from '../../types';
import { contactService } from '../../services/api';

const ContactForm: React.FC<ContactFormProps> = ({
  className,
  onSubmit,
  title,
  description,
  submitButtonText,
  successMessage,
  errorMessage
}) => {
  const { t } = useTranslation('contact');

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Envoyer le message à travers notre service API
        await contactService.sendContactMessage({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });
      }

      setSubmitted(true);

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      // Gérer les erreurs ici
      console.error('Error submitting form', err);
      setError(errorMessage || t('contact.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <Title as="h3">{title || t('contact.formTitle')}</Title>

      {description && (
        <p className="text-gray-600 mt-2">{description}</p>
      )}

      {submitted ? (
        <motion.div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {successMessage || t('contact.successMessage')}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

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
            {isSubmitting ? t('contact.form.sending') : submitButtonText || t('contact.form.send')}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
