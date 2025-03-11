import { render, screen } from '@testing-library/react';
import Features from '../Features';

describe('Features Component', () => {
  test('renders section title correctly', () => {
    render(<Features />);

    // Vérifier que le titre de la section est présent (clé de traduction)
    expect(screen.getByText('features.title')).toBeInTheDocument();
  });

  test('renders all feature cards', () => {
    render(<Features />);

    // Vérifier que les cartes de fonctionnalités sont présentes (clés de traduction)
    expect(screen.getByText('features.items.wishlists.title')).toBeInTheDocument();
    expect(screen.getByText('features.items.events.title')).toBeInTheDocument();
    expect(screen.getByText('features.items.inspiration.title')).toBeInTheDocument();
    expect(screen.getByText('features.items.groups.title')).toBeInTheDocument();
    expect(screen.getByText('features.items.reminders.title')).toBeInTheDocument();
    expect(screen.getByText('features.items.privacy.title')).toBeInTheDocument();
  });

  test('renders feature descriptions', () => {
    render(<Features />);

    // Vérifier que les descriptions des fonctionnalités sont présentes (clés de traduction)
    expect(screen.getByText('features.items.wishlists.description')).toBeInTheDocument();
    expect(screen.getByText('features.items.events.description')).toBeInTheDocument();
    expect(screen.getByText('features.items.inspiration.description')).toBeInTheDocument();
    expect(screen.getByText('features.items.groups.description')).toBeInTheDocument();
  });

  test('renders feature icons', () => {
    render(<Features />);

    // Vérifier que les icônes sont présentes (en vérifiant les éléments SVG)
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThanOrEqual(6); // Exactement 6 icônes pour les fonctionnalités
  });
});
