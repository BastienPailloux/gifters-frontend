import React from 'react';
import { useTranslation } from 'react-i18next';
import FlatButton from '../common/forms/FlatButton';
import { FaChevronRight, FaTools } from 'react-icons/fa';
import { UpcomingEventsListProps } from '../../types';

const UpcomingEventsList: React.FC<UpcomingEventsListProps> = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-4">
        {t('dashboard.upcomingEvents')}
      </h3>

      <div className="bg-yellow-50 p-4 rounded-md text-yellow-800 flex items-center mb-4">
        <FaTools className="mr-3 h-5 w-5 text-yellow-600" />
        <div>
          <p className="font-medium">{t('common.underConstruction.title')}</p>
          <p className="text-sm">{t('common.underConstruction.description')}</p>
        </div>
      </div>

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
