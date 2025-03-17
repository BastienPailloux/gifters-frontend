import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FlatButton from '../common/forms/FlatButton';
import { FaChevronRight } from 'react-icons/fa';
import UpcomingEventItem from './UpcomingEventItem';
import { UpcomingEvent, UpcomingEventsListProps } from '../../types';

const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({ maxEvents = 5 }) => {
  const { t } = useTranslation();
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // TODO: Récupérer les événements à venir depuis l'API
        // Cette fonctionnalité nécessiterait un endpoint spécifique pour récupérer les anniversaires
        // et autres événements. Pour l'instant, nous utilisons des données fictives.
        const mockUpcomingEvents: UpcomingEvent[] = [
          {
            id: '1',
            type: 'birthday',
            date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5),
            personName: 'Sophie Martin',
            groupName: 'Famille',
            daysLeft: 5
          },
          {
            id: '2',
            type: 'birthday',
            date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 12),
            personName: 'Thomas Dubois',
            groupName: 'Amis',
            daysLeft: 12
          },
          {
            id: '3',
            type: 'christmas',
            date: new Date(new Date().getFullYear(), 11, 25),
            personName: 'Noël',
            groupName: 'Famille',
            daysLeft: Math.round((new Date(new Date().getFullYear(), 11, 25).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          }
        ];

        // Tri des événements par nombre de jours restants (du plus proche au plus éloigné)
        const sortedEvents = mockUpcomingEvents.sort((a, b) => {
          const daysLeftA = a.daysLeft ?? a.daysUntil ?? 0;
          const daysLeftB = b.daysLeft ?? b.daysUntil ?? 0;
          return daysLeftA - daysLeftB;
        });

        setUpcomingEvents(sortedEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching upcoming events:', err);
        setError(t('dashboard.errors.loadingEvents'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-4">
        {t('dashboard.upcomingEvents')}
      </h3>

      {upcomingEvents.length > 0 ? (
        <ul className="space-y-3">
          {upcomingEvents.slice(0, maxEvents).map((event) => (
            <UpcomingEventItem key={event.id} event={event} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">{t('dashboard.noUpcomingEvents')}</p>
      )}

      <div className="mt-4">
        <FlatButton
          asLink
          href="/events"
          variant="primary"
          icon={<FaChevronRight className="h-3 w-3" />}
          iconPosition="right"
        >
          {t('dashboard.viewAllEvents')}
        </FlatButton>
      </div>
    </div>
  );
};

export default UpcomingEventsList;
