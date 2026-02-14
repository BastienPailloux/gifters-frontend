import { useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordToggleButtonProps {
  /** true = mot de passe visible (afficher l’icône "masquer") */
  visible: boolean;
  onToggle: () => void;
  className?: string;
}

const PasswordToggleButton: React.FC<PasswordToggleButtonProps> = ({
  visible,
  onToggle,
  className = '',
}) => {
  const { t } = useTranslation('auth');

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`p-1 rounded text-gray-500 hover:text-gray-700 focus:outline-none ${className}`}
      aria-label={visible ? t('hidePassword') : t('showPassword')}
      tabIndex={-1}
    >
      {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
    </button>
  );
};

export default PasswordToggleButton;
