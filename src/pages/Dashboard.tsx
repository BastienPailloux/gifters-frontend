import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DashboardSummaryCard from '../components/dashboard/DashboardSummaryCard';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="py-6 overflow-y-auto h-full transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out">
        {/* Carte principale du dashboard avec le résumé */}
        <DashboardSummaryCard user={user} />

        {/* Cartes d'actions rapides */}
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">{t('dashboard.cards.gifts.title')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('dashboard.cards.gifts.description')}</p>
              <div className="mt-4">
                <Link
                  to="/gifts"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t('dashboard.cards.gifts.action')}
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">{t('dashboard.cards.events.title')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('dashboard.cards.events.description')}</p>
              <div className="mt-4">
                <Link
                  to="/events"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t('dashboard.cards.events.action')}
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">{t('dashboard.cards.profile.title')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('dashboard.cards.profile.description')}</p>
              <div className="mt-4">
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t('dashboard.cards.profile.action')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
