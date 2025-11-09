import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../common/forms/Button';
import { Child } from '../../types/children';
import Avatar from '../common/display/Avatar';

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

  const handleCardClick = () => {
    navigate(`/profile/${child.id}`);
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

  return (
    <div
      className="flex items-center justify-between py-4 hover:bg-gray-50 rounded-md px-3 transition-colors duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Avatar name={child.name} size="sm" />
          <p className="text-base font-medium text-gray-900">{child.name}</p>
        </div>
      </div>

      <div className="flex gap-2">
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
