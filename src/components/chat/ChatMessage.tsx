// src/components/chat/ChatMessage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
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
        {isUser || isError ? (
          displayContent
        ) : (
          <ReactMarkdown
            components={{
              a: ({ href, children }) => (
                <a href={href} className="underline hover:opacity-80" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
              h3: ({ children }) => <h3 className="font-semibold mt-3 mb-1">{children}</h3>,
              h4: ({ children }) => <h4 className="font-medium mt-2 mb-1">{children}</h4>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              hr: () => <hr className="my-3 border-gray-300" />,
            }}
          >
            {displayContent}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
