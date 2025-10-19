import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from '../../components/auth/AuthForm';
import Input from '../../components/common/forms/Input';
import Button from '../../components/common/forms/Button';
import { SEO } from '../../components/common/seo';

const ResetPassword: React.FC = () => {
  const { t } = useTranslation('auth');
  const { resetPassword, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirmation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const resetToken = searchParams.get('reset_password_token');
    if (resetToken) {
      setToken(resetToken);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      return;
    }

    clearError();
    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      if (resetPassword) {
        const result = await resetPassword({
          reset_password_token: token,
          password: formData.password,
          password_confirmation: formData.passwordConfirmation,
        });

        if (result.success) {
          setSuccessMessage(result.message || t('auth:resetPassword.successMessage'));
          setFormData({ password: '', passwordConfirmation: '' });

          // Rediriger vers la page de connexion après 3 secondes
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si aucun token n'est fourni, afficher un message d'erreur
  if (!token) {
    return (
      <>
        <SEO translationKey="resetPassword" />
        <AuthForm
          title={t('auth:resetPassword.title')}
          subtitle={t('auth:resetPassword.noToken')}
          linkText={t('auth:backToLogin')}
          linkUrl="/login"
          error={t('auth:resetPassword.invalidLink')}
          onSubmit={(e) => e.preventDefault()}
        >
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={() => navigate('/login')}
          >
            {t('auth:backToLogin')}
          </Button>
        </AuthForm>
      </>
    );
  }

  return (
    <>
      <SEO translationKey="resetPassword" />
      <AuthForm
        title={t('auth:resetPassword.title')}
        subtitle={t('auth:resetPassword.subtitle')}
        linkText={t('auth:backToLogin')}
        linkUrl="/login"
        error={error}
        successMessage={successMessage}
        onSubmit={handleSubmit}
      >
        {!successMessage ? (
          <>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              label={t('auth:fields.newPassword')}
            />

            <Input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              required
              value={formData.passwordConfirmation}
              onChange={handleInputChange}
              label={t('auth:fields.confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {t('auth:resetPassword.submit')}
            </Button>
          </>
        ) : (
          <div className="mt-4">
            <p className="text-center mb-4">{successMessage}</p>
            <p className="text-center text-sm text-gray-500">
              {t('auth:resetPassword.redirecting')}
            </p>
          </div>
        )}
      </AuthForm>
    </>
  );
};

export default ResetPassword;
