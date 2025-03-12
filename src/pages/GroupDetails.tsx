import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { groupService } from '../services/api';
import Button from '../components/common/forms/Button';
import GroupItemsList from '../components/groups/GroupItemsList';
import PageHeader from '../components/common/layout/PageHeader';

// Types
interface GroupDetailsData {
  id: string;
  name: string;
  description?: string;
  members?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  }[];
  events?: {
    id: string;
    title: string;
    date: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
}

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [group, setGroup] = useState<GroupDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!id) {
        setError(t('common.error') || 'Group ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await groupService.getGroup(id);

        // Gestion de la réponse de l'API
        let groupData = null;
        if (result && result.data) {
          groupData = result.data;
        } else if (result) {
          groupData = result;
        }

        if (!groupData) {
          throw new Error('No group data received');
        }

        setGroup(groupData);
        setError(null);
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError(t('common.error') || 'Failed to load group details');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id, t]);

  // Fonctions de gestion des événements
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditGroup = () => {
    // Sera implémenté ultérieurement
    alert('Edit functionality coming soon!');
  };

  const handleViewMembers = () => {
    // Sera implémenté ultérieurement
    alert('View members functionality coming soon!');
  };

  const handleCreateEvent = () => {
    // Sera implémenté ultérieurement
    alert('Create event functionality coming soon!');
  };

  const handleAddGiftIdea = () => {
    // Sera implémenté ultérieurement
    alert('Add gift idea functionality coming soon!');
  };

  const handleViewEvent = (eventId: string) => {
    // Sera implémenté ultérieurement
    alert(`View event ${eventId} functionality coming soon!`);
  };

  // Rendu des éléments de liste
  const renderEvent = (event: Event) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900">{event.title}</p>
        <p className="text-sm text-gray-500">
          {new Date(event.date).toLocaleDateString()}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewEvent(event.id)}
      >
        {t('common.view') || 'View'}
      </Button>
    </div>
  );

  // Rendu des actions d'en-tête
  const renderHeaderActions = () => (
    <>
      <Button
        variant="primary"
        onClick={handleViewMembers}
      >
        {t('groups.viewMembers') || 'View Members'}
      </Button>
      <Button
        variant="outline"
        onClick={handleEditGroup}
      >
        {t('common.edit') || 'Edit'}
      </Button>
    </>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error || t('common.error')}</h3>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleBackClick}
        >
          {t('common.back') || 'Back'}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <PageHeader
        title={group.name}
        description={group.description}
        onBackClick={handleBackClick}
        actions={renderHeaderActions()}
      />

      {/* Contenu principal - 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Événements à venir */}
        <GroupItemsList
          title={t('groups.upcomingEvents') || 'Upcoming Events'}
          items={group.events}
          emptyMessage={t('groups.noEvents') || 'No events scheduled.'}
          actionLabel={t('groups.createEvent') || 'Create Event'}
          onAction={handleCreateEvent}
          renderItem={renderEvent}
        />

        {/* Liste des cadeaux - pour l'instant avec une liste vide car API ne retourne pas encore les gift ideas */}
        <GroupItemsList
          title={t('groups.giftIdeas') || 'Gift Ideas'}
          items={[]}
          emptyMessage={t('groups.noGiftIdeas') || 'No gift ideas have been shared yet.'}
          actionLabel={t('groups.addGiftIdea') || 'Add Gift Idea'}
          onAction={handleAddGiftIdea}
          renderItem={() => <div />} // Pas encore de rendu pour les gift ideas
        />
      </div>
    </div>
  );
};

export default GroupDetails;
