import {
  LinkedInIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  GitHubIcon,
  YouTubeIcon,
  SocialIconProps
} from './SocialIcons';

// Mapping des noms d'icônes avec leurs composants
export const SocialIcons: Record<string, React.FC<SocialIconProps>> = {
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  github: GitHubIcon,
  youtube: YouTubeIcon
};
