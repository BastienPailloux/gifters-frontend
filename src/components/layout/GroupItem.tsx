import React from 'react';
import { Link } from 'react-router-dom';
import { SideMenuGroupItemProps } from '../../types';

const GroupItem: React.FC<SideMenuGroupItemProps> = ({ id, name, isActive = false }) => {
  return (
    <Link
      to={`/groups/${id}`}
      className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-primary-100 text-primary-900'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div
        className={`mr-3 h-5 w-5 flex items-center justify-center ${isActive ? 'text-primary-500' : 'text-gray-400'}`}
        style={{ fontWeight: 'bold' }}
      >
        #
      </div>
      <span className="truncate">{name}</span>
    </Link>
  );
};

export default GroupItem;
