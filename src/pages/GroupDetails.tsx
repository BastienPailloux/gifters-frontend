import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { groupService } from '../services/api';

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

  const handleInviteMember = () => {
    // Sera implémenté ultérieurement
    alert('Invite functionality coming soon!');
  };

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
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md shadow-sm transition-colors"
        >
          {t('common.back') || 'Back'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <button
            onClick={handleBackClick}
            className="inline-flex items-center mb-4 text-sm text-gray-500 hover:text-gray-700"
          >
            <svg className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back') || 'Back'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
          {group.description && (
            <p className="mt-2 text-gray-500">{group.description}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleInviteMember}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md shadow-sm transition-colors"
          >
            {t('groups.inviteMember') || 'Invite Member'}
          </button>
          <button
            onClick={handleEditGroup}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md shadow-sm transition-colors"
          >
            {t('common.edit') || 'Edit'}
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau latéral - Membres */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('groups.members') || 'Members'}</h2>

            {group.members && group.members.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {group.members.map(member => (
                  <li key={member.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary-100 text-primary-800 h-8 w-8 rounded-full flex items-center justify-center font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    {member.role && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {member.role}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{t('groups.noMembers') || 'No members yet.'}</p>
            )}
          </div>
        </div>

        {/* Zone principale de contenu */}
        <div className="lg:col-span-2">
          {/* Événements à venir */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('groups.upcomingEvents') || 'Upcoming Events'}</h2>

            {group.events && group.events.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {group.events.map(event => (
                  <li key={event.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                        {t('common.view') || 'View'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{t('groups.noEvents') || 'No events scheduled.'}</p>
            )}

            <div className="mt-4">
              <button className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                {t('groups.createEvent') || 'Create Event'}
              </button>
            </div>
          </div>

          {/* Liste des cadeaux */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('groups.giftIdeas') || 'Gift Ideas'}</h2>

            <p className="text-gray-500 mb-4">{t('groups.noGiftIdeas') || 'No gift ideas have been shared yet.'}</p>

            <div className="mt-4">
              <button className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                {t('groups.addGiftIdea') || 'Add Gift Idea'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
