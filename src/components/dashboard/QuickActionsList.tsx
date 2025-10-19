import React from 'react';
import { useTranslation } from 'react-i18next';
import QuickActionCard from './QuickActionCard';
import { FaGift, FaCalendarAlt, FaUserCog } from 'react-icons/fa';
import { FaUsersGear } from 'react-icons/fa6';
import { QuickActionProps, QuickActionsListProps } from '../../types/dashboard';

const QuickActionsList: React.FC<QuickActionsListProps> = ({ className = '' }) => {
  const { t } = useTranslation('dashboard');

  // Liste des actions rapides disponibles
  const actions: QuickActionProps[] = [
    {
      title: t('dashboard.cards.gifts.title'),
      description: t('dashboard.cards.gifts.description'),
      actionLabel: t('dashboard.cards.gifts.action'),
      route: '/gifts',
      icon: <FaGift className="h-6 w-6" />
    },
    {
      title: t('dashboard.cards.events.title'),
      description: t('dashboard.cards.events.description'),
      actionLabel: t('dashboard.cards.events.action'),
      route: '/events',
      icon: <FaCalendarAlt className="h-6 w-6" />
    },
    {
      title: t('dashboard.cards.profile.title'),
      description: t('dashboard.cards.profile.description'),
      actionLabel: t('dashboard.cards.profile.action'),
      route: '/profile',
      icon: <FaUserCog className="h-6 w-6" />
    },
    {
      title: t('dashboard.cards.children.title'),
      description: t('dashboard.cards.children.description'),
      actionLabel: t('dashboard.cards.children.action'),
      route: '/children',
      icon: <FaUsersGear className="h-6 w-6" />
    }
  ];

  return (
    <div className={className}>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {t('dashboard.quickActions')}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => (
          <QuickActionCard
            key={index}
            title={action.title}
            description={action.description}
            actionLabel={action.actionLabel}
            route={action.route}
            icon={action.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActionsList;
