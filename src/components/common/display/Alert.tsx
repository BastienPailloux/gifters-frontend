import React from 'react';

type AlertType = 'warning' | 'info' | 'error' | 'success';

interface AlertProps {
  type?: AlertType;
  children: React.ReactNode;
  className?: string;
}

/**
 * Composant Alert pour afficher des messages avec différents types
 * Supporte : warning, info, error, success
 */
const Alert: React.FC<AlertProps> = ({
  type = 'info',
  children,
  className = ''
}) => {
  const getStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-amber-50 border-amber-200',
          text: 'text-amber-800'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          text: 'text-red-800'
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          text: 'text-green-800'
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`${styles.container} border rounded-md p-4 ${className}`}>
      <div className={`text-sm ${styles.text}`}>
        {children}
      </div>
    </div>
  );
};

export default Alert;
