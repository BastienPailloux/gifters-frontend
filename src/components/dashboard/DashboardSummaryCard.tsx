import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../common/display/Card';
import UpcomingEventsList from './UpcomingEventsList';
import BuyingGiftsList from './BuyingGiftsList';
import { DashboardSummaryCardProps } from '../../types/dashboard';

const DashboardSummaryCard: React.FC<DashboardSummaryCardProps> = ({ user }) => {
  const { t } = useTranslation();

  return (
    <Card
      title={t('dashboard.welcome') + (user?.name ? `, ${user.name}` : '')}
      subtitle={t('dashboard.summary')}
      className="mb-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingEventsList maxEvents={5} />
        <BuyingGiftsList maxGifts={5} />
      </div>
    </Card>
  );
};

export default DashboardSummaryCard;
