import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { groupService, giftIdeaService } from '../services/api';
import Button from '../components/common/forms/Button';
import GroupItemsList from '../components/groups/GroupItemsList';
import PageHeader from '../components/common/layout/PageHeader';
import GiftIdeaItem from '../components/groups/GiftIdeaItem';
import MembersList from '../components/groups/MembersList';
import GroupEditModal from '../components/groups/GroupEditModal';
import GiftIdeaCreationModal from '../components/groups/GiftIdeaCreationModal';
import useAuth from '../hooks/useAuth';

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

// Type pour la réponse API des idées de cadeaux
interface ApiGiftIdea {
  id: number | string;
  title: string;
  status: string;
  forUser?: { id: number | string; name: string } | string;
  forUserName?: string;
  recipients?: Array<{ id: number | string; name: string }>;
  price?: number;
  for_user_name?: string;
}

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState<GroupDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminStatusLoaded, setAdminStatusLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [giftIdeas, setGiftIdeas] = useState<ApiGiftIdea[]>([]);
  const [showMembers, setShowMembers] = useState<boolean>(false);
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [isGroupEditModalOpen, setIsGroupEditModalOpen] = useState<boolean>(false);
  const [isGiftIdeaModalOpen, setIsGiftIdeaModalOpen] = useState<boolean>(false);

  // Fonction pour récupérer les détails du groupe
  const fetchGroupDetails = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const groupData = await groupService.getGroup(id);
      setGroup(groupData);

      // Vérifier si l'utilisateur est admin du groupe
      if (groupData && groupData.members && user) {
        const currentUserMember = groupData.members.find(
          (member: {id: string; name: string; email: string; role?: string}) => member.id === user.id
        );
        setIsUserAdmin(
          currentUserMember?.role === 'admin'
        );
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching group details:', err);
      setError(t('common.error') || 'Failed to load group details');
    } finally {
      setLoading(false);
      setAdminStatusLoaded(true);
    }
  };

  // Récupérer les détails du groupe
  useEffect(() => {
    fetchGroupDetails();
  }, [id, t, user]);

  // Récupérer les idées de cadeaux du groupe
  useEffect(() => {
    const fetchGiftIdeas = async () => {
      if (!id) return;

      try {
        // Ne récupérer que les idées avec statut "proposed" ou "buying"
        const result = await giftIdeaService.getGiftIdeasByGroup(id, ['proposed', 'buying']);

        // Mapper les données API en GiftIdea
        if (result && result.giftIdeas) {
          const mappedGifts = result.giftIdeas.map((gift: ApiGiftIdea): ApiGiftIdea => {
            // Déterminer le nom du destinataire
            let recipientName = t('common.unknownUser');
            if (gift.forUser && typeof gift.forUser === 'object' && gift.forUser.name) {
              recipientName = gift.forUser.name;
            } else if (gift.forUserName) {
              recipientName = gift.forUserName;
            } else if (gift.forUser && typeof gift.forUser === 'string') {
              recipientName = gift.forUser as string;
            }

            return {
              ...gift,
              for_user_name: recipientName,
              recipients: gift.recipients?.map(r => ({
                id: String(r.id),
                name: r.name
              }))
            };
          });

          setGiftIdeas(mappedGifts);
        }
      } catch (err) {
        console.error('Error fetching gift ideas:', err);
      }
    };

    fetchGiftIdeas();
  }, [id, t]);

  // Fonctions de gestion des événements
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditGroup = () => {
    setIsGroupEditModalOpen(true);
  };

  const handleViewMembers = () => {
    setShowMembers(!showMembers);
  };

  const handleCreateEvent = () => {
    // Sera implémenté ultérieurement
    alert('Create event functionality coming soon!');
  };

  const handleAddGiftIdea = () => {
    setIsGiftIdeaModalOpen(true);
  };

  const handleViewEvent = (eventId: string) => {
    // Sera implémenté ultérieurement
    alert(`View event ${eventId} functionality coming soon!`);
  };

  const handleViewGift = (giftId: string) => {
    // Naviguer vers la page de détails de l'idée cadeau
    navigate(`/gift-ideas/${giftId}`);
  };

  // Fonction pour rafraîchir les idées de cadeaux après en avoir ajouté une nouvelle
  const handleGiftIdeaCreationSuccess = () => {
    if (id) {
      // Rafraîchir la liste des idées de cadeaux
      const fetchGiftIdeas = async () => {
        try {
          // Ne récupérer que les idées avec statut "proposed" ou "buying"
          const result = await giftIdeaService.getGiftIdeasByGroup(id, ['proposed', 'buying']);

          // Mapper les données API en GiftIdea
          if (result && result.giftIdeas) {
            const mappedGifts = result.giftIdeas.map((gift: ApiGiftIdea): ApiGiftIdea => {
              // Déterminer le nom du destinataire
              let recipientName = t('common.unknownUser');
              if (gift.forUser && typeof gift.forUser === 'object' && gift.forUser.name) {
                recipientName = gift.forUser.name;
              } else if (gift.forUserName) {
                recipientName = gift.forUserName;
              } else if (gift.forUser && typeof gift.forUser === 'string') {
                recipientName = gift.forUser as string;
              }

              return {
                ...gift,
                for_user_name: recipientName,
                recipients: gift.recipients?.map(r => ({
                  id: String(r.id),
                  name: r.name
                }))
              };
            });

            setGiftIdeas(mappedGifts);
          }
        } catch (err) {
          console.error('Error fetching gift ideas:', err);
        }
      };

      fetchGiftIdeas();
    }
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

  // Rendu des idées de cadeaux
  const renderGiftIdea = (gift: ApiGiftIdea) => (
    <GiftIdeaItem
      gift={{
        id: String(gift.id),
        title: gift.title,
        for_user_name: gift.for_user_name || '',
        recipients: gift.recipients?.map(r => ({
          id: String(r.id),
          name: r.name
        })),
        price: gift.price,
        status: gift.status as 'proposed' | 'buying' | 'bought'
      }}
      onViewGift={handleViewGift}
    />
  );

  // Rendu des actions d'en-tête
  const renderHeaderActions = () => (
    <>
      <Button
        variant="primary"
        onClick={handleViewMembers}
      >
        {showMembers ? t('groups.hideMembers') : t('groups.viewMembers')}
      </Button>
      {isUserAdmin && (
        <Button
          variant="outline"
          onClick={handleEditGroup}
        >
          {t('common.edit') || 'Edit'}
        </Button>
      )}
    </>
  );

  if (loading || !adminStatusLoaded) {
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
    <div className="p-6 mx-auto">
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

        {/* Liste des idées de cadeaux */}
        <GroupItemsList
          title={t('giftIdeas.title') || 'Gift Ideas'}
          items={giftIdeas}
          emptyMessage={t('giftIdeas.noGiftIdeas') || 'No gift ideas have been shared yet.'}
          actionLabel={t('giftIdeas.addGiftIdea') || 'Add Gift Idea'}
          onAction={handleAddGiftIdea}
          renderItem={renderGiftIdea}
        />
      </div>

      {showMembers && id && (
        <MembersList
          groupId={id}
          groupName={group.name}
          isCurrentUserAdmin={isUserAdmin}
        />
      )}

      {isGroupEditModalOpen && (
        <GroupEditModal
          isOpen={isGroupEditModalOpen}
          onClose={() => setIsGroupEditModalOpen(false)}
          group={group}
          onUpdate={() => {
            // Rafraîchir les données du groupe
            if (id) {
              fetchGroupDetails();
            }
          }}
        />
      )}

      {isGiftIdeaModalOpen && group && id && (
        <GiftIdeaCreationModal
          isOpen={isGiftIdeaModalOpen}
          onClose={() => setIsGiftIdeaModalOpen(false)}
          groupId={id}
          groupMembers={group.members || []}
          onSuccess={handleGiftIdeaCreationSuccess}
        />
      )}
    </div>
  );
};

export default GroupDetails;
