import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/dateUtils';
import { ProfileCardProps } from '../../types';

const ProfileCard: React.FC<ProfileCardProps> = ({ user, isCurrentUser, onEdit, hidePersonalInfo = true }) => {
  const { t } = useTranslation('profile');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          {!hidePersonalInfo && <p className="text-gray-600">{user.email}</p>}
        </div>
        {isCurrentUser && (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('profile:editProfile')}
          </button>
        )}
      </div>

      {!hidePersonalInfo && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile:personalInfo')}</h3>
          <div className="space-y-3 mb-6">
            {user.birthday && (
              <div className="flex items-center">
                <span className="text-gray-600 w-32">{t('profile:birthday')}:</span>
                <span className="text-gray-900">{formatDate(user.birthday)}</span>
              </div>
            )}
            {user.phone_number && (
              <div className="flex items-center">
                <span className="text-gray-600 w-32">{t('profile:phone')}:</span>
                <span className="text-gray-900">{user.phone_number}</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile:address')}</h3>
          <div className="space-y-3">
            {user.address && (
              <div className="flex items-center">
                <span className="text-gray-600 w-32">{t('profile:street')}:</span>
                <span className="text-gray-900">{user.address}</span>
              </div>
            )}
            {user.city && (
              <div className="flex items-center">
                <span className="text-gray-600 w-32">{t('profile:city')}:</span>
                <span className="text-gray-900">{user.city}</span>
              </div>
            )}
            {user.state && (
              <div className="flex items-center">
                <span className="text-gray-600 w-32">{t('profile:state')}:</span>
                <span className="text-gray-900">{user.state}</span>
              </div>
            )}
            {user.zip_code && (
              <div className="flex items-center">
                <span className="text-gray-600 w-32">{t('profile:zipCode')}:</span>
                <span className="text-gray-900">{user.zip_code}</span>
              </div>
            )}
            {user.country && (
              <div className="flex items-center">
                <span className="text-gray-600 w-32">{t('profile:country')}:</span>
                <span className="text-gray-900">{user.country}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
