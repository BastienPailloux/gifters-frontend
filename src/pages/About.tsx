import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Title, Subtitle } from '../components/common/typography';
import { SEO } from '../components/common/seo';
import { CallToAction } from '../components/common/cta';
import { AboutCardGrid } from '../components/about';

const About: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Données des cartes
  const aboutCards = [
    {
      title: t('about.ourStory.title', 'Notre histoire'),
      paragraphs: [
        t('about.ourStory.paragraph1', 'Gifters est né d\'une expérience personnelle : la difficulté d\'organiser des cadeaux de groupe sans doublons et avec une répartition équitable des dépenses.'),
        t('about.ourStory.paragraph2', 'Lancé en 2023, notre plateforme vise à simplifier la coordination des cadeaux pour les anniversaires, fêtes et occasions spéciales.')
      ]
    },
    {
      title: t('about.mission.title', 'Notre mission'),
      paragraphs: [
        t('about.mission.paragraph1', 'Faciliter l\'organisation des cadeaux de groupe pour que chaque occasion soit mémorable sans le stress des détails logistiques.'),
        t('about.mission.paragraph2', 'Nous croyons que la générosité doit être simple et agréable, libérée des contraintes administratives et financières.')
      ]
    },
    {
      title: t('about.team.title', 'Notre équipe'),
      paragraphs: [
        t('about.team.paragraph1', 'Nous sommes une équipe passionnée d\'entrepreneurs et de développeurs partageant la même vision : rendre les célébrations plus joyeuses et moins stressantes.'),
        t('about.team.paragraph2', 'Notre diversité est notre force - des profils différents unis par la volonté de créer une solution utile au quotidien.')
      ]
    },
    {
      title: t('about.values.title', 'Nos valeurs'),
      paragraphs: [
        t('about.values.paragraph1', 'Simplicité, transparence et convivialité sont au cœur de notre approche.'),
        t('about.values.paragraph2', 'Nous développons Gifters avec le souci constant de l\'expérience utilisateur et de la protection des données personnelles.')
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <SEO
        translationKey="about.seo"
        title={t('about.seo.title', 'À propos | Gifters')}
        description={t('about.seo.description', 'Découvrez l\'histoire de Gifters, notre mission et notre équipe dédiée.')}
        keywords={t('about.seo.keywords', 'à propos, équipe, mission, vision, gifters').split(',')}
        type="website"
      />

      <div className="text-center mb-16">
        <Title as="h1" centered animated>
          {t('about.title', 'À propos de Gifters')}
        </Title>
        <Subtitle centered animated maxWidth="2xl">
          {t('about.subtitle', 'Découvrez notre histoire et notre mission pour faciliter l\'organisation de cadeaux')}
        </Subtitle>
      </div>

      <AboutCardGrid items={aboutCards} className="mb-16" />

      {/* Contactez-nous */}
      <div className="bg-primary-50 rounded-lg p-8 my-16">
        <CallToAction
          message={t('about.contact.description', 'Vous avez des questions, des suggestions ou souhaitez rejoindre l\'aventure ? N\'hésitez pas à nous contacter.')}
          buttonText={t('about.contact.button', 'Nous contacter')}
          buttonProps={{
            onClick: () => navigate('/contact'),
            variant: 'secondary'
          }}
          className="bg-transparent"
          animated
        />
      </div>
    </div>
  );
};

export default About;
