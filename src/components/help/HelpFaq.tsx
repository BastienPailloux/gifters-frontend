import React from 'react';
import { Faq, FaqItem } from '../common/faq';
import { Title } from '../common/typography';

interface HelpFaqProps {
  className?: string;
}

const HelpFaq: React.FC<HelpFaqProps> = ({ className }) => {
  // Exemple de questions/réponses en dur (sans traduction)
  const generalFaqItems: FaqItem[] = [
    {
      question: "Comment fonctionne Gifters ?",
      answer: "Gifters vous permet de créer des listes de souhaits et de les partager avec vos proches. Vous pouvez également rejoindre des groupes pour coordonner l'achat de cadeaux."
    },
    {
      question: "Comment puis-je contacter le support ?",
      answer: "Vous pouvez contacter notre équipe de support via la page Contact ou en envoyant un email à support@gifters.com."
    }
  ];

  // Questions sur les fonctionnalités, utilisant des clés de traduction
  const featuresFaqItems: FaqItem[] = [
    {
      question: "",
      answer: "",
      translationKey: "help.features.item1"
    },
    {
      question: "",
      answer: "",
      translationKey: "help.features.item2"
    },
    {
      question: "",
      answer: "",
      translationKey: "help.features.item3"
    }
  ];

  return (
    <div className={`${className} space-y-8`}>
      <Title as="h1" centered>Centre d'aide</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FAQ générale */}
        <Faq
          items={generalFaqItems}
          title="Aide générale"
          titleSize="h3"
        />

        {/* FAQ sur les fonctionnalités */}
        <Faq
          items={featuresFaqItems}
          titleTranslationKey="help.features.title"
          translationPrefix="help.features"
          titleSize="h3"
        />
      </div>
    </div>
  );
};

export default HelpFaq;
