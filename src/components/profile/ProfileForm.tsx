import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../common/forms/Input';
import Button from '../common/forms/Button';
import Checkbox from '../common/forms/Checkbox';
import { ProfileFormProps, ProfileFormData } from '../../types';

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSubmit, onCancel }) => {
  const { t } = useTranslation('profile');
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name || '',
    email: user.email || '',
    birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
    phone_number: user.phone_number || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    zip_code: user.zip_code || '',
    country: user.country || '',
    current_password: '',
    password: '',
    password_confirmation: '',
    newsletter_subscription: user.newsletter_subscription || false
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Créer une copie du formData
      const dataToSubmit = { ...formData };

      // Si le nouveau mot de passe est vide, supprimer les champs liés au mot de passe
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
        delete dataToSubmit.password_confirmation;
        delete dataToSubmit.current_password;
      }

      await onSubmit(dataToSubmit);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('common:error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('profile:editProfile')}</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Informations personnelles */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile:personalInfo')}</h3>
          <div className="space-y-4">
            <Input
              label={t('profile:name')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label={t('profile:email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label={t('profile:birthday')}
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
            />
            <Input
              label={t('profile:phone')}
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Adresse */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile:address')}</h3>
          <div className="space-y-4">
            <Input
              label={t('profile:street')}
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <Input
              label={t('profile:city')}
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <Input
              label={t('profile:state')}
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
            <Input
              label={t('profile:zipCode')}
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
            />
            <Input
              label={t('profile:country')}
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="mb-8">
        <Checkbox
          id="newsletter_subscription"
          name="newsletter_subscription"
          checked={formData.newsletter_subscription}
          onChange={handleChange}
          label={t('contact:newsletter.subscribe', 'Je souhaite recevoir la newsletter')}
        />
      </div>

      {/* Séparateur */}
      <hr className="border-gray-200 my-6" />

      {/* Changement de mot de passe */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile:changePassword')}</h3>
        <div className="space-y-4">
          <Input
            label={t('profile:currentPassword')}
            name="current_password"
            type="password"
            value={formData.current_password}
            onChange={handleChange}
            helperText={t('profile:currentPasswordRequired')}
          />
          <Input
            label={t('profile:newPassword')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            label={t('profile:confirmPassword')}
            name="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t('common:cancel')}
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {t('common:save')}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
