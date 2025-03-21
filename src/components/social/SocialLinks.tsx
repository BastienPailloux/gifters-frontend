import React from 'react';
import { SocialIconComponentProps } from './SocialIcons';
import { SocialIcons } from './socialIconsMap';
import { SocialLinksProps, SocialNetwork } from '../../types/social';

// Étendre l'interface SocialNetwork pour inclure les propriétés spécifiques à ce composant
interface ExtendedSocialNetwork extends SocialNetwork {
  /** Libellé d'accessibilité pour le lien */
  ariaLabel?: string;
  /** Props optionnelles pour personnaliser l'icône */
  iconProps?: SocialIconComponentProps;
}

// Étendre l'interface SocialLinksProps pour inclure les propriétés spécifiques à ce composant
interface ExtendedSocialLinksProps extends SocialLinksProps {
  /** Couleur du texte (text-) */
  textColor?: string;
  /** Couleur de survol (hover:text-) */
  hoverColor?: string;
  /** Liste des réseaux sociaux à afficher */
  networks: ExtendedSocialNetwork[];
}

const SocialLinks: React.FC<ExtendedSocialLinksProps> = ({
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
            aria-label={network.ariaLabel || network.name}
          >
            <span className="sr-only">{network.ariaLabel || network.name}</span>
            <IconComponent {...network.iconProps} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
