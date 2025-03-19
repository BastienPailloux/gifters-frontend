import React from 'react';
import { useTranslation } from 'react-i18next';
import UnderConstructionPage from '../components/common/display/UnderConstructionPage';

const Events: React.FC = () => {
  const { t } = useTranslation();

  return (
    <UnderConstructionPage
      title={t('events.title', 'Gestion des Événements')}
      description={t('events.underConstruction', 'La gestion des événements est en cours de développement. Vous pourrez bientôt créer et gérer des événements pour vos groupes !')}
    />
  );
};

export default Events;
