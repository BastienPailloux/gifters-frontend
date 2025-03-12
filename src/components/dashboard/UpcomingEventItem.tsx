import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

export interface UpcomingEvent {
  id: string;
  type: 'birthday' | 'christmas';
  date: Date;
  personName: string;
  groupName: string;
  daysLeft: number;
}

interface UpcomingEventItemProps {
  event: UpcomingEvent;
}

const UpcomingEventItem: React.FC<UpcomingEventItemProps> = ({ event }) => {
  const { t, i18n } = useTranslation();

  // Formatage de date avec support multilingue
  const formatDate = (date: Date) => {
    const locale = i18n.language === 'fr' ? fr : enUS;
    return format(date, 'dd MMMM yyyy', { locale });
  };

  return (
    <li className="bg-gray-50 p-3 rounded-md">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-sm font-medium text-gray-900">
            {event.type === 'birthday' ? t('dashboard.birthday') : t('dashboard.christmas')}
            {event.type === 'birthday' ? `: ${event.personName}` : ''}
          </span>
          <p className="text-sm text-gray-500">
            {formatDate(event.date)} • {event.groupName}
          </p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.daysLeft <= 7 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
          {event.daysLeft} {t('dashboard.daysLeft')}
        </span>
      </div>
    </li>
  );
};

export default UpcomingEventItem;
