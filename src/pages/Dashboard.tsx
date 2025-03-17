import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardSummaryCard from '../components/dashboard/DashboardSummaryCard';
import QuickActionsList from '../components/dashboard/QuickActionsList';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="py-6 overflow-y-auto h-full transition-all duration-300 ease-in-out">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out">
        {/* Carte principale du dashboard avec le résumé */}
        <DashboardSummaryCard user={user} />

        {/* Actions rapides */}
        <QuickActionsList className="mt-8" />
      </div>
    </div>
  );
};

export default Dashboard;
