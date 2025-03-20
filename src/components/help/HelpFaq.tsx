import React from 'react';
import { Faq } from '../common/faq';
import { Title } from '../common/typography';
import { HelpFaqProps, FaqItem } from '../../types';

const HelpFaq: React.FC<HelpFaqProps> = ({ className, faqs, title, description, contactLink, contactLinkText }) => {
  // Exemple de questions/réponses en dur (sans traduction)
  const generalFaqItems: FaqItem[] = [
    {
      id: 1,
      question: "Comment fonctionne Gifters ?",
      answer: "Gifters vous permet de créer des listes de souhaits et de les partager avec vos proches. Vous pouvez également rejoindre des groupes pour coordonner l'achat de cadeaux."
    },
    {
      id: 2,
      question: "Comment puis-je contacter le support ?",
      answer: "Vous pouvez contacter notre équipe de support via la page Contact ou en envoyant un email à support@gifters.com."
    }
  ];

  // Questions sur les fonctionnalités, utilisant des clés de traduction
  const featuresFaqItems: FaqItem[] = [
    {
      id: 'f1',
      question: "",
      answer: "",
      translationKey: "help.features.item1"
    },
    {
      id: 'f2',
      question: "",
      answer: "",
      translationKey: "help.features.item2"
    },
    {
      id: 'f3',
      question: "",
      answer: "",
      translationKey: "help.features.item3"
    }
  ];

  return (
    <div className={`${className} space-y-8`}>
      <Title as="h1" centered>{title || 'Centre d\'aide'}</Title>

      {description && <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">{description}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FAQ générale */}
        <Faq
          items={faqs || generalFaqItems}
          title="Aide générale"
        />

        {/* FAQ sur les fonctionnalités */}
        <Faq
          items={featuresFaqItems}
          titleTranslationKey="help.features.title"
          translationPrefix="help.features"
        />
      </div>

      {contactLink && (
        <div className="text-center mt-8">
          <a href={contactLink} className="text-primary-600 hover:text-primary-800 font-medium">
            {contactLinkText || 'Besoin d\'aide ? Contactez-nous'}
          </a>
        </div>
      )}
    </div>
  );
};

export default HelpFaq;
