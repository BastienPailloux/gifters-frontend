import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useChat } from '../../contexts/ChatContext';
import ChatPanel from './ChatPanel';

const ChatWidget: React.FC = () => {
  const { t } = useTranslation('chat');
  const { isOpen, toggleWidget } = useChat();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <ChatPanel variant="floating" />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleWidget}
        aria-label={t('chat:widgetLabel')}
        className="w-12 h-12 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 active:scale-95 transition-all flex items-center justify-center text-xl"
      >
        {isOpen ? '✕' : '✨'}
      </button>
    </div>
  );
};

export default ChatWidget;
