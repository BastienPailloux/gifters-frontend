import React from 'react';
import { twMerge } from 'tailwind-merge';
import { LabelValueProps } from '../../../types';

/**
 * Composant LabelValue - Affiche une paire label/valeur avec différentes options de mise en forme
 * Utilisé principalement pour les détails et les informations structurées
 */
const LabelValue: React.FC<LabelValueProps> = ({
  label,
  value,
  className = '',
  labelClassName = '',
  valueClassName = '',
  orientation = 'vertical',
  isImportant = false,
}) => {
  // Classes pour le conteneur principal
  const containerClasses = twMerge(
    'mb-4',
    orientation === 'horizontal' ? 'flex flex-row items-center gap-2' : '',
    className
  );

  // Classes pour le label
  const labelClasses = twMerge(
    'text-sm text-gray-500',
    orientation === 'horizontal' ? 'mb-0' : 'mb-1',
    labelClassName
  );

  // Classes pour la valeur
  const valueClasses = twMerge(
    isImportant ? 'font-medium' : '',
    valueClassName
  );

  return (
    <div className={containerClasses}>
      <p className={labelClasses}>{label}</p>
      {typeof value === 'string' ? (
        <p className={valueClasses}>{value}</p>
      ) : (
        <div className={valueClasses}>{value}</div>
      )}
    </div>
  );
};

export default LabelValue;
