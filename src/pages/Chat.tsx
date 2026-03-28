import React from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/common/seo';
import ChatPanel from '../components/chat/ChatPanel';

const Chat: React.FC = () => {
  const { t } = useTranslation('chat');

  return (
    <div className="flex flex-col h-full">
      <SEO title={t('chat:pageTitle')} />
      <ChatPanel variant="page" />
    </div>
  );
};

export default Chat;
