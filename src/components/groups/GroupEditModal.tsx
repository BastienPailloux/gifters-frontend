import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../common/forms/Button';
import TextInput from '../common/forms/TextInput';
import Modal from '../common/modals/Modal';
import { groupService } from '../../services/api';

interface GroupEditModalProps {
  group: {
    id: string;
    name: string;
    description?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const GroupEditModal: React.FC<GroupEditModalProps> = ({
  group,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // États pour le formulaire
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmGroupName, setConfirmGroupName] = useState('');

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t('groups.nameRequired') || 'Group name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await groupService.updateGroup(group.id, {
        name: name.trim(),
        description: description.trim(),
      });

      // Émettre un événement pour mettre à jour la liste des groupes dans le SideMenu
      const groupUpdatedEvent = new Event('groupUpdated');
      document.dispatchEvent(groupUpdatedEvent);

      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating group:', err);
      setError(t('groups.updateError') || 'Failed to update group');
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire de suppression du groupe
  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await groupService.deleteGroup(group.id);

      // Émettre un événement pour mettre à jour la liste des groupes dans le SideMenu
      const groupDeletedEvent = new Event('groupDeleted');
      document.dispatchEvent(groupDeletedEvent);

      onClose();
      navigate('/dashboard'); // Rediriger vers le dashboard après la suppression
    } catch (err) {
      console.error('Error deleting group:', err);
      setError(t('groups.deleteError') || 'Failed to delete group');
      setShowDeleteConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('groups.editGroup') || 'Edit Group'}
      size="md"
    >
      {!showDeleteConfirm ? (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <TextInput
            label={t('groups.name') || 'Group Name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('groups.namePlaceholder') || 'Enter group name'}
            required
          />

          <TextInput
            label={t('groups.description') || 'Description'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('groups.descriptionPlaceholder') || 'Enter group description (optional)'}
          />

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              {t('common.delete') || 'Delete'}
            </Button>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                {t('common.cancel') || 'Cancel'}
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('common.saving') || 'Saving...'}
                  </span>
                ) : (
                  t('common.save') || 'Save'
                )}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            {t('groups.confirmDelete') || 'Are you sure you want to delete this group?'}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {t('groups.deleteWarning') || 'This action cannot be undone. All group data will be permanently removed.'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-2">
              {t('groups.typeGroupNameToConfirm', { name: group.name }) || `Please type "${group.name}" to confirm:`}
            </p>
            <TextInput
              value={confirmGroupName}
              onChange={(e) => setConfirmGroupName(e.target.value)}
              placeholder={t('groups.confirmGroupNamePlaceholder') || "Enter group name"}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isLoading}
            >
              {t('common.cancel') || 'Cancel'}
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={isLoading || confirmGroupName !== group.name}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.deleting') || 'Deleting...'}
                </span>
              ) : (
                t('common.confirmDelete') || 'Yes, delete group'
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default GroupEditModal;
