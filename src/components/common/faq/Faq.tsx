import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export interface FaqItem {
  question: string;
  answer: string;
  translationKey?: string; // Si fourni, utilisera cette clé au lieu des valeurs question/answer
}

interface FaqProps {
  items: FaqItem[];
  title?: string;
  titleTranslationKey?: string;
  className?: string;
  itemClassName?: string;
  translationPrefix?: string; // Préfixe pour les clés de traduction automatiques
}

const Faq: React.FC<FaqProps> = ({
  items,
  title,
  titleTranslationKey,
  className = '',
  itemClassName = '',
  translationPrefix
}) => {
  const { t } = useTranslation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Fonction pour obtenir le texte à partir de la clé de traduction ou du texte brut
  const getText = (text: string, key?: string, index?: number, type?: 'question' | 'answer') => {
    if (key) {
      return t(key);
    }

    // Si un préfixe de traduction est fourni, essayer d'utiliser les clés automatiques
    if (translationPrefix && index !== undefined && type) {
      const autoKey = `${translationPrefix}.${type}${index + 1}`;
      const translated = t(autoKey);
      // Si la traduction existe (n'est pas égale à la clé), l'utiliser
      if (translated !== autoKey) {
        return translated;
      }
    }

    // Utiliser le texte brut par défaut
    return text;
  };

  return (
    <div className={className}>
      {(title || titleTranslationKey) && (
        <h2 className="text-2xl font-bold mb-6">
          {titleTranslationKey ? t(titleTranslationKey) : title}
        </h2>
      )}

      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`border-b border-gray-200 pb-4 last:border-0 ${itemClassName}`}
            variants={itemVariants}
          >
            <h3 className="font-semibold text-lg mb-2">
              {getText(item.question, item.translationKey ? `${item.translationKey}.question` : undefined, index, 'question')}
            </h3>
            <p className="text-gray-600">
              {getText(item.answer, item.translationKey ? `${item.translationKey}.answer` : undefined, index, 'answer')}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Faq;
