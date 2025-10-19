import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Title, Subtitle } from '../components/common/typography';
import { SEO } from '../components/common/seo';
import { CallToAction } from '../components/common/cta';
import { AboutCardGrid } from '../components/about';

const About: React.FC = () => {
  const { t } = useTranslation('marketing');
  const navigate = useNavigate();

  // Données des cartes
  const aboutCards = [
    {
      title: t('about.ourStory.title'),
      paragraphs: [
        t('marketing:about.ourStory.paragraph1'),
        t('marketing:about.ourStory.paragraph2')
      ]
    },
    {
      title: t('marketing:about.mission.title'),
      paragraphs: [
        t('marketing:about.mission.paragraph1'),
        t('marketing:about.mission.paragraph2')
      ]
    },
    {
      title: t('marketing:about.team.title'),
      paragraphs: [
        t('marketing:about.team.paragraph1'),
        t('marketing:about.team.paragraph2')
      ]
    },
    {
      title: t('marketing:about.values.title'),
      paragraphs: [
        t('marketing:about.values.paragraph1'),
        t('marketing:about.values.paragraph2')
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <SEO
        translationKey="about"
        title={t('marketing:about.title')}
        description={t('marketing:about.description')}
        keywords={t('marketing:about.keywords').split(',')}
        type="website"
      />

      <div className="text-center mb-16">
        <Title as="h1" centered animated>
          {t('marketing:about.title')}
        </Title>
        <Subtitle centered animated maxWidth="2xl">
          {t('marketing:about.subtitle')}
        </Subtitle>
      </div>

      <AboutCardGrid items={aboutCards} className="mb-16" />

      {/* Contactez-nous */}
      <div className="bg-primary-50 rounded-lg p-8 my-16">
        <CallToAction
          message={t('marketing:about.contact.description')}
          buttonText={t('marketing:about.contact.button')}
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
