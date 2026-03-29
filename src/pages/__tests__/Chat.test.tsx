// src/pages/__tests__/Chat.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Chat from '../Chat';

const mockSendMessage = jest.fn();
const mockLoadConversations = jest.fn().mockResolvedValue(undefined);

jest.mock('../../services/conversationService', () => ({
  conversationService: {
    list: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: 1, title: 'Test', last_activity_at: new Date().toISOString(), created_at: new Date().toISOString() }),
    get: jest.fn(),
    stream: jest.fn().mockReturnValue(() => {}),
  },
}));

jest.mock('../../contexts/ChatContext', () => ({
  useChat: () => ({
    conversations: [],
    currentConversation: null,
    steps: [],
    isStreaming: false,
    isOpen: false,
    loadConversations: mockLoadConversations,
    openConversation: jest.fn(),
    sendMessage: mockSendMessage,
    toggleWidget: jest.fn(),
    newConversation: jest.fn(),
  }),
  ChatProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../../components/chat/ConversationList', () => ({
  __esModule: true,
  default: () => <div data-testid="conversation-list" />,
}));

jest.mock('../../components/chat/ChatPanel', () => ({
  __esModule: true,
  default: ({ variant }: { variant: string }) => <div data-testid={`chat-panel-${variant}`} />,
}));

jest.mock('../../components/common/seo', () => ({
  SEO: () => null,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Chat page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls loadConversations on mount', async () => {
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <Routes><Route path="/chat" element={<Chat />} /></Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(mockLoadConversations).toHaveBeenCalledTimes(1));
  });

  it('renders ConversationList and ChatPanel', () => {
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <Routes><Route path="/chat" element={<Chat />} /></Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('conversation-list')).toBeInTheDocument();
    expect(screen.getByTestId('chat-panel-page')).toBeInTheDocument();
  });

  it('calls sendMessage with initialMessage from location state', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/chat', state: { initialMessage: 'Bonjour' } }]}>
        <Routes><Route path="/chat" element={<Chat />} /></Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(mockSendMessage).toHaveBeenCalledWith('Bonjour'));
  });

  it('does not call sendMessage without location state', async () => {
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <Routes><Route path="/chat" element={<Chat />} /></Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(mockLoadConversations).toHaveBeenCalled());
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
