import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GiftIdeaDetailCard from '../GiftIdeaDetailCard';

// Mock des fonctions de traduction
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('GiftIdeaDetailCard Component', () => {
  const mockGiftIdea = {
    id: '1',
    title: 'Test Gift',
    description: 'This is a test gift',
    price: 25.99,
    link: 'https://example.com',
    image_url: 'https://example.com/image.jpg',
    status: 'proposed' as const,
    created_at: '2025-03-17T12:00:00Z',
    updated_at: '2025-03-17T12:00:00Z',
    created_by_id: 'user1',
    created_by: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
    },
    recipients: [
      { id: 'user2', name: 'Jane Smith' },
    ],
    group_name: 'Test Group',
  };

  const mockCurrentUser = {
    id: 'user3',
    name: 'Current User',
    email: 'current@example.com',
  };

  const mockFormatPrice = (price?: number) => {
    if (!price) return '';
    return `€${price}`;
  };

  const mockHandlers = {
    onMarkAsBuying: jest.fn(),
    onMarkAsBought: jest.fn(),
  };

  test('renders gift details correctly', () => {
    render(
      <GiftIdeaDetailCard
        giftIdea={mockGiftIdea}
        currentUser={mockCurrentUser}
        onMarkAsBuying={mockHandlers.onMarkAsBuying}
        onMarkAsBought={mockHandlers.onMarkAsBought}
        formatPrice={mockFormatPrice}
      />
    );

    // Vérifier que les informations de base sont affichées
    expect(screen.getByText('giftIdeas.details')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument(); // Nom du destinataire
    expect(screen.getByText('€25.99')).toBeInTheDocument(); // Prix formaté
    expect(screen.getByText('This is a test gift')).toBeInTheDocument(); // Description
    expect(screen.getByText('https://example.com')).toBeInTheDocument(); // Lien
    expect(screen.getByText('Test Group')).toBeInTheDocument(); // Nom du groupe
    expect(screen.getByText('John Doe')).toBeInTheDocument(); // Créateur
  });

  test('renders action buttons for an eligible user', () => {
    render(
      <GiftIdeaDetailCard
        giftIdea={mockGiftIdea}
        currentUser={mockCurrentUser}
        onMarkAsBuying={mockHandlers.onMarkAsBuying}
        onMarkAsBought={mockHandlers.onMarkAsBought}
        formatPrice={mockFormatPrice}
      />
    );

    // Vérifier que les boutons d'action sont affichés
    const buyingButton = screen.getByText('giftIdeas.markAsBuying');
    expect(buyingButton).toBeInTheDocument();

    const storeLink = screen.getByText('giftIdeas.visitStore');
    expect(storeLink).toBeInTheDocument();

    // Tester le clic sur le bouton
    fireEvent.click(buyingButton);
    expect(mockHandlers.onMarkAsBuying).toHaveBeenCalledTimes(1);
  });

  test('hides action buttons for a gift recipient', () => {
    const giftWithCurrentUserAsRecipient = {
      ...mockGiftIdea,
      recipients: [
        { id: 'user3', name: 'Current User' }, // Même ID que currentUser
      ],
    };

    render(
      <GiftIdeaDetailCard
        giftIdea={giftWithCurrentUserAsRecipient}
        currentUser={mockCurrentUser}
        onMarkAsBuying={mockHandlers.onMarkAsBuying}
        onMarkAsBought={mockHandlers.onMarkAsBought}
        formatPrice={mockFormatPrice}
      />
    );

    // Vérifier que les boutons d'action ne sont pas affichés
    expect(screen.queryByText('giftIdeas.markAsBuying')).not.toBeInTheDocument();
  });

  test('renders "bought" button for a user who is buying', () => {
    const giftBeingBoughtByCurrentUser = {
      ...mockGiftIdea,
      status: 'buying' as const,
      buyer: {
        id: 'user3', // Même ID que currentUser
        name: 'Current User',
        email: 'current@example.com',
      },
      buyer_id: 'user3',
    };

    render(
      <GiftIdeaDetailCard
        giftIdea={giftBeingBoughtByCurrentUser}
        currentUser={mockCurrentUser}
        onMarkAsBuying={mockHandlers.onMarkAsBuying}
        onMarkAsBought={mockHandlers.onMarkAsBought}
        formatPrice={mockFormatPrice}
      />
    );

    // Vérifier que le bouton "J'ai acheté" est affiché
    const boughtButton = screen.getByText('giftIdeas.markAsBought');
    expect(boughtButton).toBeInTheDocument();

    // Tester le clic sur le bouton
    fireEvent.click(boughtButton);
    expect(mockHandlers.onMarkAsBought).toHaveBeenCalledTimes(1);
  });
});
