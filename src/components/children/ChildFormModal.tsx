import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/modals/Modal';
import Button from '../common/forms/Button';
import Input from '../common/forms/Input';
import { Child, CreateChildData } from '../../types/children';

interface ChildFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  child?: Child;
}

/**
 * Modal pour créer ou éditer un compte child
 */
const ChildFormModal: React.FC<ChildFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode,
  child
}) => {
  const { t } = useTranslation('profile');
  const [formData, setFormData] = useState<CreateChildData>({
    name: '',
    birthday: '',
    gender: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialiser le formulaire avec les données du child en mode édition
  useEffect(() => {
    if (mode === 'edit' && child) {
      setFormData({
        name: child.name || '',
        birthday: child.birthday || '',
        gender: child.gender || ''
      });
    } else {
      // Réinitialiser le formulaire en mode création
      setFormData({
        name: '',
        birthday: '',
        gender: ''
      });
    }
    setErrors({});
  }, [mode, child, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation:required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Import dynamique pour éviter les imports circulaires
      const { childrenService } = await import('../../services/api');

      if (mode === 'create') {
        await childrenService.createChild(formData);
      } else if (child) {
        await childrenService.updateChild(child.id.toString(), formData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving child:', error);
      setErrors({ submit: mode === 'create' ? t('children.createError') : t('children.updateError') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? t('children.createChild') : t('children.editChild')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {errors.submit}
          </div>
        )}

        <InputField
          label={t('name')}
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder={t('name')}
        />

        <InputField
          label={t('birthday')}
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          error={errors.birthday}
          placeholder={t('birthday')}
        />

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            {t('children.gender')}
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">{t('children.notSpecified')}</option>
            <option value="male">{t('children.male')}</option>
            <option value="female">{t('children.female')}</option>
            <option value="other">{t('children.other')}</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('common:cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common:saving') : (mode === 'create' ? t('common:create') : t('common:save'))}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChildFormModal;
