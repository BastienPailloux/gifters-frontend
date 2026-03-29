// src/components/chat/ChatPanel.tsx
import React, { useRef, useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useChat } from '../../contexts/ChatContext';
import ChatMessage from './ChatMessage';
import ThinkingSteps from './ThinkingSteps';

interface Props {
  variant: 'floating' | 'page';
}

const SUGGESTIONS = [
  'chat:suggestions.giftIdeas',
  'chat:suggestions.groups',
  'chat:suggestions.recommend',
];

const ChatPanel: React.FC<Props> = ({ variant }) => {
  const { t } = useTranslation('chat');
  const { currentConversation, steps, isStreaming, sendMessage } = useChat();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const messages = currentConversation?.messages ?? [];

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, steps]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage(text);
    setInput('');
  };

  const handleSuggestion = (key: string) => {
    if (isStreaming) return;
    sendMessage(t(key));
  };

  return (
    <div
      className={twMerge(
        'flex flex-col bg-white',
        variant === 'floating'
          ? 'h-[420px] w-[340px] rounded-2xl shadow-xl border border-gray-200'
          : 'h-full w-full',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">✨</span>
          <span className="text-sm font-semibold text-gray-800">{t('chat:title')}</span>
        </div>
        {variant === 'floating' && (
          <button
            onClick={() => navigate('/chat')}
            aria-label={t('chat:expandLabel')}
            className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
          >
            ⤢
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.length === 0 && steps.length === 0 ? (
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-xs text-gray-400 text-center">{t('chat:emptyHint')}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {SUGGESTIONS.map(key => (
                <button
                  key={key}
                  onClick={() => handleSuggestion(key)}
                  className="text-xs px-3 py-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {steps.length > 0 && <ThinkingSteps steps={steps} />}
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-3 pb-3 pt-1 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder={t('chat:inputPlaceholder')}
            className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="p-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={t('chat:sendLabel')}
          >
            ↑
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
