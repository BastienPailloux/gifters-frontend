import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../common/forms/Button';
import { FaUserAlt, FaBirthdayCake } from 'react-icons/fa';
import { Child } from '../../types/children';

interface ChildCardProps {
  child: Child;
  onEdit?: (childId: string | number) => void;
  onDelete?: (childId: string | number) => void;
}

/**
 * Composant qui affiche les informations d'un compte child sous forme de carte
 */
const ChildCard: React.FC<ChildCardProps> = ({ child, onEdit, onDelete }) => {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();

  const handleViewGroups = () => {
    navigate(`/children/${child.id}/groups`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(child.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(child.id);
    }
  };

  // Formater la date d'anniversaire
  const formatBirthday = (birthday?: string) => {
    if (!birthday) return null;
    try {
      const date = new Date(birthday);
      return date.toLocaleDateString();
    } catch {
      return birthday;
    }
  };

  return (
    <div className="flex items-center justify-between py-4 hover:bg-gray-50 rounded-md px-3 transition-colors duration-200">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <FaUserAlt className="text-gray-400 h-4 w-4" />
          <p className="text-base font-medium text-gray-900">{child.name}</p>
        </div>

        {child.birthday && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaBirthdayCake className="h-3 w-3" />
            <span>{formatBirthday(child.birthday)}</span>
          </div>
        )}

        {child.gender && (
          <p className="text-xs text-gray-400 mt-1">
            {t(`children.${child.gender}`, child.gender)}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewGroups}
        >
          {t('children.viewGroups')}
        </Button>

        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
          >
            {t('common:edit')}
          </Button>
        )}

        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            {t('common:delete')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChildCard;
