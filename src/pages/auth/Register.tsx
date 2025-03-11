import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import AuthForm from '../../components/auth/AuthForm';
import Input from '../../components/common/forms/Input';
import Button from '../../components/common/forms/Button';
import Checkbox from '../../components/common/forms/Checkbox';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setPasswordError(null);

    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setPasswordError(t('auth.errors.passwordMismatch'));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        name,
        email,
        password,
        password_confirmation: confirmPassword
      });
      if (result.success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTermsLabel = () => (
    <>
      {t('auth.register.acceptTerms')}{' '}
      <a href="/terms" className="font-medium text-primary-600 hover:text-primary-500">
        {t('auth.register.termsLink')}
      </a>
    </>
  );

  return (
    <AuthForm
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
      linkText={t('auth.register.loginLink')}
      linkUrl="/login"
      error={passwordError || error}
      onSubmit={handleSubmit}
    >
      <Input
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        label={t('auth.fields.name')}
      />

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

      <Input
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label={t('auth.fields.password')}
      />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        label={t('auth.fields.confirmPassword')}
      />

      <Checkbox
        id="terms"
        name="terms"
        required
        checked={acceptTerms}
        onChange={(e) => setAcceptTerms(e.target.checked)}
        label={renderTermsLabel()}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {t('auth.register.submit')}
      </Button>
    </AuthForm>
  );
};

export default Register;
