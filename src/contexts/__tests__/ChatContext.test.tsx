// src/contexts/__tests__/ChatContext.test.tsx
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatProvider, useChat } from '../ChatContext';

jest.mock('../../services/conversationService', () => ({
  conversationService: {
    list: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({
      id: 1,
      title: 'Nouvelle conversation',
      last_activity_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }),
    get: jest.fn(),
    stream: jest.fn().mockReturnValue(() => {}),
  },
}));

import { conversationService } from '../../services/conversationService';
const mockedService = conversationService as jest.Mocked<typeof conversationService>;

const TestComponent: React.FC = () => {
  const { currentConversation, isStreaming, sendMessage, loadConversations } = useChat();
  return (
    <div>
      <div data-testid="streaming">{isStreaming ? 'streaming' : 'idle'}</div>
      <div data-testid="messages">{currentConversation?.messages.length ?? 0}</div>
      <button onClick={() => sendMessage('Hello')}>send</button>
      <button onClick={() => loadConversations()}>load</button>
    </div>
  );
};

describe('ChatContext', () => {
  beforeEach(() => jest.clearAllMocks());

  it('provides initial idle state with no current conversation', () => {
    render(<ChatProvider><TestComponent /></ChatProvider>);
    expect(screen.getByTestId('streaming')).toHaveTextContent('idle');
    expect(screen.getByTestId('messages')).toHaveTextContent('0');
  });

  it('loadConversations calls conversationService.list', async () => {
    render(<ChatProvider><TestComponent /></ChatProvider>);
    await act(async () => { userEvent.click(screen.getByText('load')); });
    await waitFor(() => expect(mockedService.list).toHaveBeenCalledTimes(1));
  });

  it('sendMessage creates a new conversation when none exists', async () => {
    render(<ChatProvider><TestComponent /></ChatProvider>);
    await act(async () => { userEvent.click(screen.getByText('send')); });
    await waitFor(() => expect(mockedService.create).toHaveBeenCalledTimes(1));
    expect(mockedService.stream).toHaveBeenCalledWith(1, 'Hello', expect.any(Object));
  });

  it('sendMessage creates a new conversation when inactive > 10 min', async () => {
    const oldConv = {
      id: 99,
      title: 'Old',
      last_activity_at: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      messages: [],
    };
    mockedService.list.mockResolvedValueOnce([oldConv]);

    const TestWithLoad: React.FC = () => {
      const { sendMessage, loadConversations, openConversation } = useChat();
      return (
        <>
          <button onClick={async () => { await loadConversations(); await openConversation(99); }}>setup</button>
          <button onClick={() => sendMessage('Hi')}>send</button>
        </>
      );
    };

    mockedService.get.mockResolvedValueOnce(oldConv);
    render(<ChatProvider><TestWithLoad /></ChatProvider>);
    await act(async () => { userEvent.click(screen.getByText('setup')); });
    await act(async () => { userEvent.click(screen.getByText('send')); });
    await waitFor(() => expect(mockedService.create).toHaveBeenCalledTimes(1));
  });
});
