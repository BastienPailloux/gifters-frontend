import React from 'react';
import { Faq, FaqItem } from '../common/faq';

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
    <div className={className}>
      {/* FAQ générale */}
      <Faq
        items={generalFaqItems}
        title="Aide générale"
        className="mb-12"
      />

      {/* FAQ sur les fonctionnalités */}
      <Faq
        items={featuresFaqItems}
        titleTranslationKey="help.features.title"
        translationPrefix="help.features"
        className="mb-12"
      />
    </div>
  );
};

export default HelpFaq;
