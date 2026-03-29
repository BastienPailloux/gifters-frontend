import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ChatWidget from '../ChatWidget';
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

describe('ChatWidget', () => {
  beforeEach(() => {
    localStorage.clear();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('affiche le bouton flottant', () => {
    render(<ChatWidget />, { wrapper });
    expect(screen.getByRole('button', { name: /chat:widgetLabel/i })).toBeInTheDocument();
  });

  it('le panel est masqué par défaut', () => {
    render(<ChatWidget />, { wrapper });
    expect(screen.queryByPlaceholderText('chat:inputPlaceholder')).not.toBeInTheDocument();
  });

  it('ouvre le panel au clic sur le bouton', async () => {
    render(<ChatWidget />, { wrapper });
    await userEvent.click(screen.getByRole('button', { name: /chat:widgetLabel/i }));
    expect(screen.getByPlaceholderText('chat:inputPlaceholder')).toBeInTheDocument();
  });

  it('ferme le panel au second clic', async () => {
    render(<ChatWidget />, { wrapper });
    const btn = screen.getByRole('button', { name: /chat:widgetLabel/i });
    await userEvent.click(btn);
    await userEvent.click(btn);
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('chat:inputPlaceholder')).not.toBeInTheDocument();
    });
  });
});
