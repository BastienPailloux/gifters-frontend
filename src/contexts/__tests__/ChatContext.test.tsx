import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatProvider, useChat } from '../ChatContext';
import * as agentServiceModule from '../../services/agentService';

jest.mock('../../services/agentService');

const mockedAgentService = agentServiceModule.agentService as jest.Mocked<typeof agentServiceModule.agentService>;

const TestConsumer: React.FC = () => {
  const { messages, steps, isStreaming, isOpen, sendMessage, toggleWidget, clearHistory } = useChat();
  return (
    <div>
      <div data-testid="message-count">{messages.length}</div>
      <div data-testid="step-count">{steps.length}</div>
      <div data-testid="is-streaming">{String(isStreaming)}</div>
      <div data-testid="is-open">{String(isOpen)}</div>
      <button onClick={() => sendMessage('test')}>Send</button>
      <button onClick={toggleWidget}>Toggle</button>
      <button onClick={clearHistory}>Clear</button>
    </div>
  );
};

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChatProvider>{children}</ChatProvider>
);

describe('ChatContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    mockedAgentService.streamChat.mockReturnValue(() => {});
  });

  it('fournit les valeurs initiales par défaut', () => {
    render(<TestConsumer />, { wrapper });
    expect(screen.getByTestId('message-count').textContent).toBe('0');
    expect(screen.getByTestId('is-streaming').textContent).toBe('false');
    expect(screen.getByTestId('is-open').textContent).toBe('false');
  });

  it('ajoute le message user et passe isStreaming à true après sendMessage', async () => {
    render(<TestConsumer />, { wrapper });
    await act(async () => {
      await userEvent.click(screen.getByText('Send'));
    });
    expect(screen.getByTestId('message-count').textContent).toBe('1');
    expect(screen.getByTestId('is-streaming').textContent).toBe('true');
  });

  it('toggleWidget change isOpen', async () => {
    render(<TestConsumer />, { wrapper });
    expect(screen.getByTestId('is-open').textContent).toBe('false');
    await act(async () => {
      await userEvent.click(screen.getByText('Toggle'));
    });
    expect(screen.getByTestId('is-open').textContent).toBe('true');
  });

  it('clearHistory vide les messages', async () => {
    render(<TestConsumer />, { wrapper });
    await act(async () => {
      await userEvent.click(screen.getByText('Send'));
    });
    await act(async () => {
      await userEvent.click(screen.getByText('Clear'));
    });
    expect(screen.getByTestId('message-count').textContent).toBe('0');
  });

  it('charge l\'historique depuis localStorage', () => {
    const stored = [{ id: '1', role: 'user', content: 'Hello', timestamp: 1 }];
    localStorage.setItem('gifters_chat_history', JSON.stringify(stored));
    render(<TestConsumer />, { wrapper });
    expect(screen.getByTestId('message-count').textContent).toBe('1');
  });

  it('useChat lance une erreur hors du provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow();
    spy.mockRestore();
  });
});
