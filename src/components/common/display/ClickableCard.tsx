import React from 'react';
import Card from './Card';
import { ClickableCardProps } from '../../../types';

/**
 * Composant ClickableCard - Une extension du composant Card avec des fonctionnalités de clic améliorées
 * Inclut des styles pour l'état actif et des effets de survol
 */
const ClickableCard: React.FC<ClickableCardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  titleClassName,
  bodyClassName,
  footerClassName,
  onClick,
  variant = 'elevated',
  activeClassName = 'border-2 border-indigo-500',
  isActive = false,
}) => {
  // Combinaison des classes en fonction de l'état actif
  const combinedClassName = `${className} ${isActive ? activeClassName : ''} transition-all duration-200 hover:shadow-md`;

  return (
    <Card
      title={title}
      subtitle={subtitle}
      footer={footer}
      className={combinedClassName}
      titleClassName={titleClassName}
      bodyClassName={bodyClassName}
      footerClassName={footerClassName}
      onClick={onClick}
      hoverable={true}
      variant={variant}
    >
      {children}
    </Card>
  );
};

export default ClickableCard;
