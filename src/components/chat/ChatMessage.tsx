// src/components/chat/ChatMessage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Message } from '../../types/chat';

interface Props {
  message: Message;
}

const ChatMessage: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.content.startsWith('__error__');
  const displayContent = isError ? message.content.slice(9) : message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={twMerge('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={twMerge(
          'max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed',
          isUser
            ? 'bg-primary-500 text-white rounded-br-sm'
            : isError
              ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-sm'
              : 'bg-gray-100 text-gray-800 rounded-bl-sm',
        )}
      >
        {displayContent}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
