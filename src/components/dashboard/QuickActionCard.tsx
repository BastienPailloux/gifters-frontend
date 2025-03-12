import React from 'react';
import Card from '../common/display/Card';
import Button from '../common/forms/Button';
import { Link } from 'react-router-dom';

export interface QuickActionProps {
  title: string;
  description: string;
  actionLabel: string;
  route: string;
  icon?: React.ReactNode;
}

const QuickActionCard: React.FC<QuickActionProps> = ({
  title,
  description,
  actionLabel,
  route,
  icon
}) => {
  return (
    <Card className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex items-center mb-2">
            {icon && (
              <div className="mr-3 text-primary-500">
                {icon}
              </div>
            )}
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="mt-4">
          <Link to={route}>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              {actionLabel}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default QuickActionCard;
