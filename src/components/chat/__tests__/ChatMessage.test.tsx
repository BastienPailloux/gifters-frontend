import { render, screen } from '@testing-library/react';
import ChatMessage from '../ChatMessage';
import { Message } from '../../../types/chat';

const baseMessage = (overrides: Partial<Message> = {}): Message => ({
  id: 1,
  role: 'user',
  content: 'Bonjour',
  created_at: new Date().toISOString(),
  ...overrides,
});

describe('ChatMessage', () => {
  it('affiche le contenu du message', () => {
    render(<ChatMessage message={baseMessage({ content: 'Hello world' })} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('les messages user sont alignés à droite', () => {
    const { container } = render(<ChatMessage message={baseMessage({ role: 'user' })} />);
    expect(container.firstChild).toHaveClass('justify-end');
  });

  it('les messages assistant sont alignés à gauche', () => {
    const { container } = render(<ChatMessage message={baseMessage({ role: 'assistant' })} />);
    expect(container.firstChild).toHaveClass('justify-start');
  });

  it('les messages d\'erreur ont un style rouge', () => {
    render(<ChatMessage message={baseMessage({ role: 'assistant', content: '__error__Erreur réseau' })} />);
    const bubble = screen.getByText('Erreur réseau').closest('div');
    expect(bubble).toHaveClass('bg-red-50');
  });

  it('les messages d\'erreur affichent le message sans le préfixe __error__', () => {
    render(<ChatMessage message={baseMessage({ role: 'assistant', content: '__error__Timeout' })} />);
    expect(screen.getByText('Timeout')).toBeInTheDocument();
    expect(screen.queryByText('__error__Timeout')).not.toBeInTheDocument();
  });
});
