// src/components/chat/__tests__/ConversationList.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConversationList from '../ConversationList';

const mockOpenConversation = jest.fn();
const mockNewConversation = jest.fn();

jest.mock('../../../contexts/ChatContext', () => ({
  useChat: () => ({
    conversations: [
      { id: 1, title: 'Première discussion', last_activity_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 2, title: 'Discussion ancienne', last_activity_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date().toISOString() },
    ],
    currentConversation: { id: 1, title: 'Première discussion', last_activity_at: new Date().toISOString(), created_at: new Date().toISOString(), messages: [] },
    openConversation: mockOpenConversation,
    newConversation: mockNewConversation,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('ConversationList', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders all conversations', () => {
    render(<ConversationList />);
    expect(screen.getByText('Première discussion')).toBeInTheDocument();
    expect(screen.getByText('Discussion ancienne')).toBeInTheDocument();
  });

  it('highlights the active conversation', () => {
    render(<ConversationList />);
    const activeItem = screen.getByText('Première discussion').closest('button');
    expect(activeItem).toHaveClass('bg-primary-50');
  });

  it('calls openConversation when clicking a conversation', async () => {
    render(<ConversationList />);
    await userEvent.click(screen.getByText('Discussion ancienne'));
    expect(mockOpenConversation).toHaveBeenCalledWith(2);
  });

  it('calls newConversation when clicking the new button', async () => {
    render(<ConversationList />);
    await userEvent.click(screen.getByRole('button', { name: /nouvelle/i }));
    expect(mockNewConversation).toHaveBeenCalled();
  });
});
