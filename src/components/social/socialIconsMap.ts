import {
  LinkedInIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  GitHubIcon,
  YouTubeIcon,
  SocialIconComponentProps
} from './SocialIcons';

// Mapping des noms d'icônes avec leurs composants
export const SocialIcons: Record<string, React.FC<SocialIconComponentProps>> = {
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  github: GitHubIcon,
  youtube: YouTubeIcon
};
