import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaqAccordionProps } from '../../../types';

const FaqAccordion: React.FC<FaqAccordionProps> = ({
  faqItem,
  isOpen: controlledIsOpen,
  toggleAccordion: controlledToggle,
  className = ''
}) => {
  // Pour une utilisation non contrôlée
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Déterminer si l'accordéon est contrôlé de l'extérieur ou géré en interne
  const isControlled = controlledIsOpen !== undefined && controlledToggle !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const toggleAccordion = isControlled
    ? controlledToggle
    : () => setInternalIsOpen(!internalIsOpen);

  return (
    <div className={`p-6 ${className}`}>
      <button
        onClick={toggleAccordion}
        className="flex justify-between items-center w-full text-left font-medium"
        aria-expanded={isOpen}
      >
        <span>{faqItem.question}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 text-gray-600"
        >
          {typeof faqItem.answer === 'string' ? (
            <p>{faqItem.answer}</p>
          ) : (
            faqItem.answer
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FaqAccordion;
