export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ThinkingStep {
  id: string;
  label: string;
  status: 'running' | 'done';
}

export interface ChatContextValue {
  messages: ChatMessage[];
  steps: ThinkingStep[];
  isStreaming: boolean;
  isOpen: boolean;
  sendMessage: (text: string) => void;
  toggleWidget: () => void;
  clearHistory: () => void;
}

export interface StreamCallbacks {
  onStep: (label: string, status: 'running' | 'done') => void;
  onFinal: (content: string) => void;
  onError: (message: string) => void;
}
