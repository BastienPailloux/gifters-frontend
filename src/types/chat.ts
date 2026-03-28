// src/types/chat.ts
export interface Conversation {
  id: number;
  title: string;
  last_activity_at: string;
  created_at: string;
}

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

export interface ThinkingStep {
  id: string;
  label: string;
  status: 'running' | 'done';
}

export interface StreamCallbacks {
  onStep: (label: string, status: 'running' | 'done') => void;
  onFinal: (content: string) => void;
  onError: (message: string) => void;
}
