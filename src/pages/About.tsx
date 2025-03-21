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
      title: t('about.ourStory.title'),
      paragraphs: [
        t('about.ourStory.paragraph1'),
        t('about.ourStory.paragraph2')
      ]
    },
    {
      title: t('about.mission.title'),
      paragraphs: [
        t('about.mission.paragraph1'),
        t('about.mission.paragraph2')
      ]
    },
    {
      title: t('about.team.title'),
      paragraphs: [
        t('about.team.paragraph1'),
        t('about.team.paragraph2')
      ]
    },
    {
      title: t('about.values.title'),
      paragraphs: [
        t('about.values.paragraph1'),
        t('about.values.paragraph2')
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <SEO
        translationKey="about.seo"
        title={t('about.seo.title')}
        description={t('about.seo.description')}
        keywords={t('about.seo.keywords').split(',')}
        type="website"
      />

      <div className="text-center mb-16">
        <Title as="h1" centered animated>
          {t('about.title')}
        </Title>
        <Subtitle centered animated maxWidth="2xl">
          {t('about.subtitle')}
        </Subtitle>
      </div>

      <AboutCardGrid items={aboutCards} className="mb-16" />

      {/* Contactez-nous */}
      <div className="bg-primary-50 rounded-lg p-8 my-16">
        <CallToAction
          message={t('about.contact.description')}
          buttonText={t('about.contact.button')}
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
