// src/contexts/ChatContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Conversation, ConversationWithMessages, Message, ThinkingStep } from '../types/chat';
import { conversationService } from '../services/conversationService';

const INACTIVITY_DURATION = 10 * 60 * 1000;

interface ChatContextValue {
  conversations: Conversation[];
  currentConversation: ConversationWithMessages | null;
  steps: ThinkingStep[];
  isStreaming: boolean;
  isOpen: boolean;
  loadConversations: () => Promise<void>;
  openConversation: (id: number) => Promise<void>;
  sendMessage: (text: string) => void;
  toggleWidget: () => void;
  newConversation: () => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ConversationWithMessages | null>(null);
  const [steps, setSteps] = useState<ThinkingStep[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const currentConvRef = useRef<ConversationWithMessages | null>(null);
  useEffect(() => { currentConvRef.current = currentConversation; }, [currentConversation]);

  const cleanupRef = useRef<(() => void) | null>(null);
  useEffect(() => () => { cleanupRef.current?.(); }, []);

  const loadConversations = useCallback(async () => {
    const list = await conversationService.list();
    setConversations(list);
  }, []);

  const openConversation = useCallback(async (id: number) => {
    const conv = await conversationService.get(id);
    setCurrentConversation(conv);
  }, []);

  const newConversation = useCallback(async () => {
    const conv = await conversationService.create();
    setConversations(prev => [conv, ...prev]);
    setCurrentConversation({ ...conv, messages: [] });
    setSteps([]);
  }, []);

  const _sendMessage = async (text: string) => {
    let conv = currentConvRef.current;
    let convId: number;

    const isInactive = !conv ||
      Date.now() - new Date(conv.last_activity_at).getTime() > INACTIVITY_DURATION;

    if (isInactive) {
      const created = await conversationService.create();
      setConversations(prev => [created, ...prev]);
      conv = { ...created, messages: [] };
      setCurrentConversation(conv);
      convId = created.id;
    } else {
      convId = conv!.id;
    }

    const optimisticMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setCurrentConversation(prev => prev ? { ...prev, messages: [...prev.messages, optimisticMsg] } : null);

    const now = new Date().toISOString();
    setConversations(prev =>
      prev.map(c => c.id === convId ? { ...c, last_activity_at: now } : c)
    );

    setSteps([]);
    setIsStreaming(true);

    cleanupRef.current = conversationService.stream(convId, text, {
      onStep: (label, status) => {
        setSteps(prev => {
          const updated = prev.map(s =>
            s.status === 'running' ? { ...s, status: 'done' as const } : s,
          );
          return [...updated, { id: crypto.randomUUID(), label, status }];
        });
      },
      onFinal: (content) => {
        const msg: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content,
          created_at: new Date().toISOString(),
        };
        setCurrentConversation(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : null);
        setSteps([]);
        setIsStreaming(false);
      },
      onError: (message) => {
        const msg: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `__error__${message}`,
          created_at: new Date().toISOString(),
        };
        setCurrentConversation(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : null);
        setSteps([]);
        setIsStreaming(false);
      },
    });
  };

  const sendMessage = useCallback((text: string) => {
    if (isStreaming) return;
    void _sendMessage(text);
  }, [isStreaming]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleWidget = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversation,
      steps,
      isStreaming,
      isOpen,
      loadConversations,
      openConversation,
      sendMessage,
      toggleWidget,
      newConversation,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextValue => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
