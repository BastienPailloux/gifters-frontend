import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { UpcomingEventItemProps } from '../../types';

const UpcomingEventItem: React.FC<UpcomingEventItemProps> = ({ event }) => {
  const { t, i18n } = useTranslation('dashboard');

  // Formatage de date avec support multilingue
  const formatDate = (date: Date | string) => {
    const locale = i18n.language === 'fr' ? fr : enUS;
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, 'dd MMMM yyyy', { locale });
  };

  // Calcul des jours restants
  const daysLeft = event.daysLeft || event.daysUntil || 0;

  // Déterminer le nom du groupe à afficher
  const groupName = event.groupName || (event.group?.name || '');

  return (
    <li className="bg-gray-50 p-3 rounded-md">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-sm font-medium text-gray-900">
            {event.type === 'birthday' ? t('dashboard:birthday') : t('dashboard:christmas')}
            {event.type === 'birthday' && event.personName ? `: ${event.personName}` : ''}
          </span>
          <p className="text-sm text-gray-500">
            {formatDate(event.date)} • {groupName}
          </p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${daysLeft <= 7 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
          {daysLeft} {t('dashboard:daysLeft')}
        </span>
      </div>
    </li>
  );
};

export default UpcomingEventItem;
