import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ChatContextValue, ChatMessage, ThinkingStep } from '../types/chat';
import { agentService } from '../services/agentService';

const MAX_MESSAGES = 50;
const STORAGE_KEY = 'gifters_chat_history';

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  });
  const [steps, setSteps] = useState<ThinkingStep[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Ref always pointing to latest messages (avoids stale closure in sendMessage)
  const messagesRef = useRef<ChatMessage[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Persist to localStorage on change
  useEffect(() => {
    if (messages.length > MAX_MESSAGES) {
      setMessages(prev => prev.slice(-MAX_MESSAGES));
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = useCallback((text: string) => {
    if (isStreaming) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setSteps([]);
    setIsStreaming(true);

    const apiMessages = [...messagesRef.current, userMessage].map(m => ({
      role: m.role,
      content: m.content,
    }));

    agentService.streamChat(apiMessages, {
      onStep: (label, status) => {
        setSteps(prev => {
          const updated = prev.map(s =>
            s.status === 'running' ? { ...s, status: 'done' as const } : s,
          );
          return [...updated, { id: crypto.randomUUID(), label, status }];
        });
      },
      onFinal: (content) => {
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setSteps([]);
        setIsStreaming(false);
      },
      onError: (message) => {
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `__error__${message}`,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setSteps([]);
        setIsStreaming(false);
      },
    });
  }, [isStreaming]);

  const toggleWidget = useCallback(() => setIsOpen(prev => !prev), []);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, steps, isStreaming, isOpen, sendMessage, toggleWidget, clearHistory }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextValue => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
