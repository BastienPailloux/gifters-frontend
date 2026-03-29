import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Chat from '../Chat';
import { ChatProvider } from '../../contexts/ChatContext';

jest.mock('../../services/conversationService', () => ({
  conversationService: {
    list: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: 1, title: 'Nouvelle conversation', last_activity_at: new Date().toISOString(), created_at: new Date().toISOString() }),
    get: jest.fn().mockResolvedValue({ id: 1, title: 'T', last_activity_at: new Date().toISOString(), created_at: new Date().toISOString(), messages: [] }),
    stream: jest.fn().mockReturnValue(() => {}),
  },
}));

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter>
    <ChatProvider>{children}</ChatProvider>
  </MemoryRouter>
);

describe('Chat page', () => {
  beforeEach(() => {
    localStorage.clear();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('rend le ChatPanel en variant page', () => {
    render(<Chat />, { wrapper });
    expect(screen.getByPlaceholderText('chat:inputPlaceholder')).toBeInTheDocument();
  });

  it('n\'affiche pas le bouton expand', () => {
    render(<Chat />, { wrapper });
    expect(screen.queryByRole('button', { name: /chat:expandLabel/i })).not.toBeInTheDocument();
  });

  it('affiche les suggestions sur un chat vide', () => {
    render(<Chat />, { wrapper });
    expect(screen.getByText('chat:suggestions.giftIdeas')).toBeInTheDocument();
  });
});
