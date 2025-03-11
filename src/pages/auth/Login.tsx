import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import AuthForm from '../../components/auth/AuthForm';
import Input from '../../components/common/forms/Input';
import Button from '../../components/common/forms/Button';
import Checkbox from '../../components/common/forms/Checkbox';
import FlatButton from '../../components/common/forms/FlatButton';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

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
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
      linkText={t('auth.login.registerLink')}
      linkUrl="/register"
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
        label={t('auth.fields.email')}
      />

      <Input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label={t('auth.fields.password')}
      />

      <div className="flex items-center justify-between">
        <Checkbox
          id="remember-me"
          name="remember-me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          label={t('auth.login.rememberMe')}
          containerClassName="mb-0"
        />

        <div className="text-sm">
          <a href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
            {t('auth.login.forgotPassword')}
          </a>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {t('auth.login.submit')}
      </Button>

      {/* Forgot password link */}
      <div className="mt-2 flex justify-end">
        <FlatButton
          variant="primary"
          asLink
          href="/auth/forgot-password"
          size="small"
        >
          {t('auth.forgotPassword')}
        </FlatButton>
      </div>
    </AuthForm>
  );
};

export default Login;
