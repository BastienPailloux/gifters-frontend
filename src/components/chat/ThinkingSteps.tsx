import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThinkingStep } from '../../types/chat';

interface Props {
  steps: ThinkingStep[];
}

const ThinkingSteps: React.FC<Props> = ({ steps }) => {
  if (steps.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 py-1 pl-1">
      <AnimatePresence initial={false}>
        {steps.map(step => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-xs"
          >
            {step.status === 'running' ? (
              <span
                role="img"
                aria-label="en cours"
                className="inline-block animate-spin text-primary-500"
              >
                ⟳
              </span>
            ) : (
              <span className="text-green-500">✓</span>
            )}
            <span className={step.status === 'done' ? 'text-gray-400' : 'text-gray-600'}>
              {step.label}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ThinkingSteps;
