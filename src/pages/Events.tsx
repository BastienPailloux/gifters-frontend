import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstructionPage from '../components/common/display/UnderConstructionPage';
import { SEO } from '../components/common/seo';

const Events: React.FC = () => {
  const { t } = useTranslation('events');

  return (
    <>
      <SEO translationKey="seo.events" />
      <UnderConstructionPage
        title={t('events.title', 'Gestion des Événements')}
        description={t('events.underConstruction', 'La gestion des événements est en cours de développement. Vous pourrez bientôt créer et gérer des événements pour vos groupes !')}
      />
    </>
  );
};

export default Events;
