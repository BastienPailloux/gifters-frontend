import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/layout/PageHeader';
import Button from '../../components/common/forms/Button';
import Card from '../../components/common/display/Card';
import ChildCard from '../../components/children/ChildCard';
import AddChildCard from '../../components/children/AddChildCard';
import ChildFormModal from '../../components/children/ChildFormModal';
import ConfirmationModal from '../../components/common/modals/ConfirmationModal';
import { SEO } from '../../components/common/seo';
import { childrenService } from '../../services/api';
import { Child, ChildrenListState } from '../../types/children';

/**
 * Page "Mes Comptes Managés" qui affiche tous les comptes children de l'utilisateur
 * Permet de créer, éditer et supprimer des comptes managés
 */
const MyChildren: React.FC = () => {
  const { t } = useTranslation('profile');
  const { user } = useAuth();

  const [state, setState] = useState<ChildrenListState>({
    children: [],
    loading: true,
    error: null
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fonction pour charger tous les comptes children de l'utilisateur
  const fetchChildren = async () => {
    if (!user) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Appel à l'API pour récupérer les children
      const response = await childrenService.getChildren();

      // Gestion robuste de la réponse
      let childrenData: Child[] = [];

      if (response) {
        if (Array.isArray(response)) {
          childrenData = response;
        } else if (response.data && Array.isArray(response.data)) {
          childrenData = response.data;
        } else if (response.children && Array.isArray(response.children)) {
          childrenData = response.children;
        }
      }

      setState(prev => ({ ...prev, children: childrenData, loading: false }));
    } catch (err) {
      console.error('Error fetching children:', err);
      setState(prev => ({ ...prev, error: t('common:error'), loading: false }));
    }
  };

  // Chargement des children au montage du composant
  useEffect(() => {
    fetchChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fonction pour ouvrir le modal de création
  const handleCreateChild = () => {
    setIsCreateModalOpen(true);
  };

  // Fonction appelée après la création d'un child
  const handleChildCreated = () => {
    setIsCreateModalOpen(false);
    fetchChildren();
  };

  // Fonction pour ouvrir le modal d'édition
  const handleEditChild = (childId: string | number) => {
    const child = state.children.find(c => c.id === childId);
    if (child) {
      setSelectedChild(child);
      setIsEditModalOpen(true);
    }
  };

  // Fonction appelée après la mise à jour d'un child
  const handleChildUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedChild(null);
    fetchChildren();
  };

  // Fonction pour ouvrir le modal de suppression
  const handleDeleteChild = (childId: string | number) => {
    const child = state.children.find(c => c.id === childId);
    if (child) {
      setSelectedChild(child);
      setIsDeleteModalOpen(true);
    }
  };

  // Fonction pour confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!selectedChild) return;

    setIsDeleting(true);
    try {
      await childrenService.deleteChild(selectedChild.id.toString());
      setIsDeleteModalOpen(false);
      setSelectedChild(null);
      fetchChildren();
    } catch (err) {
      console.error('Error deleting child:', err);
      setState(prev => ({ ...prev, error: t('profile:children.deleteError') }));
    } finally {
      setIsDeleting(false);
    }
  };

  // Afficher le message d'erreur si nécessaire
  if (state.error) {
    return (
      <div className="p-4">
        <SEO translationKey="children" />
        <PageHeader title={t('profile:children.myChildren')} />
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          {state.error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <SEO translationKey="children" />
      <PageHeader
        title={t('profile:children.myChildren')}
        description={t('profile:children.myChildrenDescription')}
        actions={
          <Button
            variant="primary"
            onClick={handleCreateChild}
          >
            {t('profile:children.addChild')}
          </Button>
        }
      />

      {state.loading ? (
        <Card>
          <div className="flex justify-center items-center h-40 p-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="p-4 divide-y divide-gray-200">
              {state.children.length === 0 ? (
                <p className="text-gray-500 p-4 text-center">
                  {t('profile:children.noChildren')}
                </p>
              ) : (
                state.children.map(child => (
                  <ChildCard
                    key={child.id}
                    child={child}
                    onEdit={handleEditChild}
                    onDelete={handleDeleteChild}
                  />
                ))
              )}
            </div>
          </Card>

          <div className="mt-6">
            <AddChildCard onClick={handleCreateChild} />
          </div>
        </>
      )}

      {/* Modal pour créer un nouveau child */}
      {/* <ChildFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleChildCreated}
        mode="create"
      /> */}

      {/* Modal pour éditer un child */}
      {selectedChild && (
        <ChildFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedChild(null);
          }}
          onSuccess={handleChildUpdated}
          mode="edit"
          child={selectedChild}
        />
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedChild(null);
        }}
        onConfirm={handleConfirmDelete}
        title={t('profile:children.deleteChild')}
        message={`${t('profile:children.confirmDelete')}\n\n${t('profile:children.deleteWarning')}`}
        confirmText={t('common:confirmDelete')}
        cancelText={t('common:cancel')}
        isLoading={isDeleting}
        confirmVariant="danger"
      />
    </div>
  );
};

export default MyChildren;
