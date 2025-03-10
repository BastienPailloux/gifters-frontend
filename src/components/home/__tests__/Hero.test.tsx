import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Hero from '../Hero';

// Wrapper pour fournir le contexte du routeur
const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('Hero Component', () => {
  test('renders headline correctly', () => {
    renderWithRouter(<Hero />);

    // Vérifier que le titre principal est présent
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Simplifiez la gestion de vos cadeaux/i)).toBeInTheDocument();
  });

  test('renders description correctly', () => {
    renderWithRouter(<Hero />);

    // Vérifier que la description est présente
    expect(screen.getByText(/Créez des listes de souhaits, organisez des événements/i)).toBeInTheDocument();
  });

  test('renders call-to-action buttons', () => {
    renderWithRouter(<Hero />);

    // Vérifier que les boutons CTA sont présents
    expect(screen.getByRole('link', { name: /commencer gratuitement/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /en savoir plus/i })).toBeInTheDocument();
  });

  test('renders hero image', () => {
    renderWithRouter(<Hero />);

    // Vérifier que l'image est présente
    const heroImage = screen.getByAltText(/Gifters platform/i);
    expect(heroImage).toBeInTheDocument();
    expect(heroImage.tagName).toBe('IMG');
  });
});
