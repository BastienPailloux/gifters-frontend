import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from '../../components/auth/AuthForm';
import Input from '../../components/common/forms/Input';
import Button from '../../components/common/forms/Button';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const { requestPasswordReset, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      if (requestPasswordReset) {
        const result = await requestPasswordReset(email);
        if (result.success) {
          setSuccessMessage(result.message || t('auth.forgotPassword.successMessage'));
          setEmail(''); // Reset the email field
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title={t('auth.forgotPassword.title')}
      subtitle={t('auth.forgotPassword.subtitle')}
      linkText={t('auth.backToLogin')}
      linkUrl="/login"
      error={error}
      success={successMessage}
      onSubmit={handleSubmit}
    >
      {!successMessage ? (
        <>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label={t('auth.fields.email')}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {t('auth.forgotPassword.submit')}
          </Button>
        </>
      ) : (
        <div className="mt-4">
          <p className="text-center mb-4">{t('auth.forgotPassword.checkEmail')}</p>
          <Link
            to="/login"
            className="block text-center text-primary-600 hover:text-primary-500"
          >
            {t('auth.backToLogin')}
          </Link>
        </div>
      )}
    </AuthForm>
  );
};

export default ForgotPassword;
