import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import AuthForm from '../../components/auth/AuthForm';
import Input from '../../components/common/forms/Input';
import Button from '../../components/common/forms/Button';
import Checkbox from '../../components/common/forms/Checkbox';
import FlatButton from '../../components/common/forms/FlatButton';
import { SEO } from '../../components/common/seo';

const Login: React.FC = () => {
  const { t } = useTranslation('auth');
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    try {
      const result = await login({ email, password });
      if (result.success) {
        const target = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard';
        navigate(target);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO translationKey="login" />
      <AuthForm
        title={t('auth:login.title')}
        subtitle={t('auth:login.subtitle')}
        linkText={t('auth:login.registerLink')}
        linkUrl={redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : '/register'}
        error={error}
        onSubmit={handleSubmit}
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label={t('auth:fields.email')}
        />

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label={t('auth:fields.password')}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            id="remember-me"
            name="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            label={t('auth:login.rememberMe')}
            containerClassName="mb-0"
          />

          <FlatButton
            variant="primary"
            asLink
            href="/forgot-password"
            size="small"
          >
            {t('auth:forgotPasswordMessage')}
          </FlatButton>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {t('auth:login.submit')}
        </Button>

      </AuthForm>
    </>
  );
};

export default Login;
