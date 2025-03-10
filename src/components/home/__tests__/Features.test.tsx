import React from 'react';
import { render, screen } from '@testing-library/react';
import Features from '../Features';

describe('Features Component', () => {
  test('renders section title correctly', () => {
    render(<Features />);

    // Vérifier que le titre de la section est présent
    expect(screen.getByRole('heading', { name: /fonctionnalités principales/i })).toBeInTheDocument();
  });

  test('renders all feature cards', () => {
    render(<Features />);

    // Vérifier que les cartes de fonctionnalités sont présentes
    expect(screen.getByRole('heading', { name: /listes de souhaits/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /événements/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /suggestions/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /partage/i })).toBeInTheDocument();
  });

  test('renders feature descriptions', () => {
    render(<Features />);

    // Vérifier que les descriptions des fonctionnalités sont présentes
    expect(screen.getByText(/créez et partagez facilement vos listes/i)).toBeInTheDocument();
    expect(screen.getByText(/organisez des événements/i)).toBeInTheDocument();
    expect(screen.getByText(/recevez des suggestions/i)).toBeInTheDocument();
    expect(screen.getByText(/partagez vos listes/i)).toBeInTheDocument();
  });

  test('renders feature icons', () => {
    render(<Features />);

    // Vérifier que les icônes sont présentes (en vérifiant les éléments SVG)
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThanOrEqual(4); // Au moins 4 icônes pour les fonctionnalités
  });
});
