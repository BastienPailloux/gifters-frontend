import React from 'react';
import { useTranslation } from 'react-i18next';
import { Title, Subtitle } from '../components/common/typography';
import { SEO } from '../components/common/seo';

/**
 * Page des conditions générales d'utilisation
 */
const TermsAndConditions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEO
        translationKey="termsAndConditions.seo"
        title={t('termsAndConditions.seo.title', 'Conditions Générales d\'Utilisation - Gifters')}
        description={t('termsAndConditions.seo.description', 'Consultez les conditions générales d\'utilisation de Gifters. Apprenez-en plus sur vos droits et obligations en tant qu\'utilisateur de la plateforme.')}
        keywords={t('termsAndConditions.seo.keywords', 'conditions, CGU, termes, utilisation, règles, gifters').split(',')}
        type="article"
      />

      <div className="text-center mb-8">
        <Title as="h1" centered>
          {t('termsAndConditions.title', 'Conditions Générales d\'Utilisation')}
        </Title>
        <Subtitle centered maxWidth="2xl">
          {t('termsAndConditions.subtitle', 'Dernière mise à jour : mars 2025')}
        </Subtitle>
      </div>

      <div className="prose prose-lg mx-auto">
        <section className="mb-8">
          <h2>{t('termsAndConditions.introduction.title', 'Introduction')}</h2>
          <p>{t('termsAndConditions.introduction.content', 'Bienvenue sur Gifters. Les présentes conditions générales d\'utilisation régissent votre utilisation de notre site web et de notre application mobile, accessibles via www.gifters.fr. En utilisant notre plateforme, vous acceptez ces conditions dans leur intégralité. Si vous n\'êtes pas d\'accord avec ces conditions, veuillez ne pas utiliser notre plateforme.')}</p>
        </section>

        <section className="mb-8">
          <h2>{t('termsAndConditions.definitions.title', 'Définitions')}</h2>
          <p>{t('termsAndConditions.definitions.contentIntro', 'Dans les présentes conditions générales d\'utilisation, les termes suivants ont la signification indiquée ci-dessous :')}</p>
          <ul>
            <li><strong>{t('termsAndConditions.definitions.platform', 'Plateforme')}</strong>: {t('termsAndConditions.definitions.platformDef', 'le site web et l\'application mobile de Gifters.')}</li>
            <li><strong>{t('termsAndConditions.definitions.user', 'Utilisateur')}</strong>: {t('termsAndConditions.definitions.userDef', 'toute personne qui accède à la plateforme et crée un compte.')}</li>
            <li><strong>{t('termsAndConditions.definitions.content', 'Contenu')}</strong>: {t('termsAndConditions.definitions.contentDef', 'tous les textes, images, vidéos et autres matériels publiés sur la plateforme.')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>{t('termsAndConditions.account.title', 'Compte Utilisateur')}</h2>
          <p>{t('termsAndConditions.account.content1', 'Pour utiliser certaines fonctionnalités de notre plateforme, vous devez créer un compte. Vous êtes responsable de maintenir la confidentialité de votre compte et mot de passe, et de restreindre l\'accès à votre ordinateur. Vous acceptez d\'assumer la responsabilité de toutes les activités qui se produisent sous votre compte ou mot de passe.')}</p>
          <p>{t('termsAndConditions.account.content2', 'Gifters se réserve le droit de refuser le service, de supprimer ou de modifier le contenu, ou d\'annuler des comptes à sa seule discrétion.')}</p>
        </section>

        <section className="mb-8">
          <h2>{t('termsAndConditions.userContent.title', 'Contenu de l\'Utilisateur')}</h2>
          <p>{t('termsAndConditions.userContent.content1', 'En publiant du contenu sur notre plateforme, vous garantissez que :')}</p>
          <ul>
            <li>{t('termsAndConditions.userContent.point1', 'Vous êtes le propriétaire du contenu ou vous avez le droit de le publier.')}</li>
            <li>{t('termsAndConditions.userContent.point2', 'Le contenu ne viole pas les droits de propriété intellectuelle, la vie privée ou d\'autres droits d\'un tiers.')}</li>
            <li>{t('termsAndConditions.userContent.point3', 'Le contenu n\'est pas illégal, abusif, menaçant, diffamatoire ou autrement répréhensible.')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>{t('termsAndConditions.intellectualProperty.title', 'Propriété Intellectuelle')}</h2>
          <p>{t('termsAndConditions.intellectualProperty.content', 'Le contenu, les fonctionnalités et la disponibilité de la plateforme sont la propriété de Gifters et sont protégés par les lois internationales sur les droits d\'auteur, les marques déposées, les brevets, les secrets commerciaux et autres lois sur la propriété intellectuelle.')}</p>
        </section>

        <section className="mb-8">
          <h2>{t('termsAndConditions.limitation.title', 'Limitation de Responsabilité')}</h2>
          <p>{t('termsAndConditions.limitation.content', 'Gifters ne sera pas responsable des dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de l\'utilisation ou de l\'impossibilité d\'utiliser la plateforme ou les services associés.')}</p>
        </section>

        <section className="mb-8">
          <h2>{t('termsAndConditions.changes.title', 'Modifications des Conditions')}</h2>
          <p>{t('termsAndConditions.changes.content', 'Gifters se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des modifications importantes. L\'utilisation continue de la plateforme après de telles modifications constitue votre acceptation des nouvelles conditions.')}</p>
        </section>

        <section className="mb-8">
          <h2>{t('termsAndConditions.contact.title', 'Contact')}</h2>
          <p>{t('termsAndConditions.contact.content', 'Si vous avez des questions concernant ces conditions, veuillez nous contacter à support@gifters.fr.')}</p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
