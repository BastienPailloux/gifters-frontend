import React, { ReactNode } from 'react';

interface ActionBannerProps {
  /** Titre principal du banner */
  title: string;
  /** Description secondaire (optionnelle) */
  description?: string;
  /** Icône principale à gauche */
  icon: ReactNode;
  /** Icône secondaire à droite (optionnelle, ex: +, flèche) */
  actionIcon?: ReactNode;
  /** Fonction appelée au clic */
  onClick?: () => void;
  /** Classes CSS additionnelles */
  className?: string;
  /** Couleur de fond en gradient (from) */
  gradientFrom?: string;
  /** Couleur de fond en gradient (to) */
  gradientTo?: string;
}

/**
 * Composant ActionBanner - Banner d'action proéminent et personnalisable
 * Affiche un appel à l'action clair avec des animations subtiles
 */
const ActionBanner: React.FC<ActionBannerProps> = ({
  title,
  description,
  icon,
  actionIcon,
  onClick,
  className = '',
  gradientFrom = 'from-primary-500',
  gradientTo = 'to-primary-600'
}) => {
  return (
    <div className={className}>
      <button
        onClick={onClick}
        className={`group relative w-full overflow-hidden rounded-xl bg-gradient-to-r ${gradientFrom} ${gradientTo} p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-300`}
      >
        {/* Background decoration - hidden on mobile */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-150 hidden sm:block" />
        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5 hidden sm:block" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Icon container - smaller on mobile */}
            <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:rotate-12">
              {icon}
            </div>
            
            {/* Text content */}
            <div className="text-left">
              <h3 className="text-base sm:text-xl font-bold text-white">
                {title}
              </h3>
              {description && (
                <p className="text-xs sm:text-sm text-white/80 hidden xs:block">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {/* Action icon - hidden on mobile */}
          {actionIcon && (
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-600 shadow-md transition-transform duration-300 group-hover:rotate-90">
              {actionIcon}
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

export default ActionBanner;
