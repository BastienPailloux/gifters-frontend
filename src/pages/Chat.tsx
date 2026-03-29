// src/pages/Chat.tsx
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/common/seo';
import ChatPanel from '../components/chat/ChatPanel';
import ConversationList from '../components/chat/ConversationList';
import { useChat } from '../contexts/ChatContext';

const Chat: React.FC = () => {
  const { t } = useTranslation('chat');
  const { loadConversations, sendMessage } = useChat();
  const location = useLocation();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initialMessage = (location.state as { initialMessage?: string } | null)?.initialMessage;
    loadConversations().then(() => {
      if (initialMessage) {
        sendMessage(initialMessage);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full">
      <SEO title={t('pageTitle')} />
      <div className="w-64 border-r border-gray-100 flex-shrink-0 hidden md:block">
        <ConversationList />
      </div>
      <div className="flex-1 min-w-0">
        <ChatPanel variant="page" />
      </div>
    </div>
  );
};

export default Chat;
