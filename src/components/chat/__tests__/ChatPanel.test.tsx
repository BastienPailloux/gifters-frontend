import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ChatPanel from '../ChatPanel';
import { ChatProvider } from '../../../contexts/ChatContext';

jest.mock('../../../services/conversationService', () => ({
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

describe('ChatPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // jsdom does not implement scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('affiche les chips de suggestion sur un chat vide', () => {
    render(<ChatPanel variant="floating" />, { wrapper });
    // i18next mock returns the key as-is: 'chat:suggestions.giftIdeas'
    expect(screen.getByText('chat:suggestions.giftIdeas')).toBeInTheDocument();
  });

  it('envoie un message en cliquant sur une suggestion', async () => {
    const { conversationService } = jest.requireMock('../../../services/conversationService');
    render(<ChatPanel variant="floating" />, { wrapper });
    const chip = screen.getByText('chat:suggestions.giftIdeas');
    await userEvent.click(chip);
    expect(conversationService.stream).toHaveBeenCalledTimes(1);
  });

  it('envoie un message via le formulaire', async () => {
    const { conversationService } = jest.requireMock('../../../services/conversationService');
    render(<ChatPanel variant="floating" />, { wrapper });
    // i18next mock returns 'chat:inputPlaceholder' as the placeholder
    const input = screen.getByPlaceholderText('chat:inputPlaceholder');
    await userEvent.type(input, 'Bonjour{Enter}');
    expect(conversationService.stream).toHaveBeenCalledTimes(1);
  });

  it('désactive l\'input pendant le streaming', async () => {
    render(<ChatPanel variant="floating" />, { wrapper });
    const input = screen.getByPlaceholderText('chat:inputPlaceholder');
    await userEvent.type(input, 'test{Enter}');
    expect(input).toBeDisabled();
  });

  it('affiche le bouton expand en variant floating', () => {
    render(<ChatPanel variant="floating" />, { wrapper });
    // i18next mock returns 'chat:expandLabel' as the aria-label
    expect(screen.getByRole('button', { name: 'chat:expandLabel' })).toBeInTheDocument();
  });

  it('n\'affiche pas le bouton expand en variant page', () => {
    render(<ChatPanel variant="page" />, { wrapper });
    expect(screen.queryByRole('button', { name: 'chat:expandLabel' })).not.toBeInTheDocument();
  });
});
