// src/components/chat/ConversationList.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useChat } from '../../contexts/ChatContext';

function formatRelativeDate(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

const ConversationList: React.FC = () => {
  const { t } = useTranslation('chat');
  const { conversations, currentConversation, openConversation, newConversation } = useChat();

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {t('conversations')}
        </p>
        <button
          onClick={() => void newConversation()}
          className="w-full text-sm font-medium text-primary-600 hover:text-primary-700 py-1.5 px-3 rounded-lg hover:bg-primary-50 transition-colors text-left"
        >
          + {t('newConversation')}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map(conv => (
          <button
            key={conv.id}
            onClick={() => void openConversation(conv.id)}
            className={twMerge(
              'w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50',
              currentConversation?.id === conv.id ? 'bg-primary-50' : '',
            )}
          >
            <div className="text-sm font-medium text-gray-800 truncate">{conv.title}</div>
            <div className="text-xs text-gray-400 mt-0.5">{formatRelativeDate(conv.last_activity_at)}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
