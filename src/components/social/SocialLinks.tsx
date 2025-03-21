import React from 'react';
import { SocialIconProps } from './SocialIcons';
import { SocialIcons } from './socialIconsMap';

// Type pour un réseau social
export interface SocialNetwork {
  /** Nom unique du réseau social (doit correspondre à une clé dans SocialIcons) */
  name: string;
  /** URL vers laquelle l'utilisateur sera redirigé */
  url: string;
  /** Libellé d'accessibilité pour le lien */
  ariaLabel: string;
  /** Props optionnelles pour personnaliser l'icône */
  iconProps?: SocialIconProps;
}

// Props du composant
interface SocialLinksProps {
  /** Liste des réseaux sociaux à afficher */
  networks: SocialNetwork[];
  /** Classes supplémentaires pour le conteneur */
  className?: string;
  /** Couleur du texte (text-) */
  textColor?: string;
  /** Couleur de survol (hover:text-) */
  hoverColor?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  networks,
  className = '',
  textColor = 'text-gray-400',
  hoverColor = 'hover:text-white'
}) => {
  // Si aucun réseau n'est fourni, on n'affiche rien
  if (!networks || networks.length === 0) {
    return null;
  }

  return (
    <div className={`flex space-x-4 ${className}`}>
      {networks.map((network, index) => {
        // Récupérer le composant d'icône correspondant au réseau social
        const IconComponent = SocialIcons[network.name];

        // Si l'icône n'existe pas, on n'affiche pas ce réseau
        if (!IconComponent) return null;

        return (
          <a
            key={`${network.name}-${index}`}
            href={network.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${textColor} ${hoverColor}`}
            aria-label={network.ariaLabel}
          >
            <span className="sr-only">{network.ariaLabel}</span>
            <IconComponent {...network.iconProps} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
