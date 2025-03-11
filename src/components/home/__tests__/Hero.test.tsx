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
    expect(screen.getByText('hero.title')).toBeInTheDocument();
  });

  test('renders description correctly', () => {
    renderWithRouter(<Hero />);

    // Vérifier que la description est présente
    expect(screen.getByText('hero.description')).toBeInTheDocument();
  });

  test('renders call-to-action buttons', () => {
    renderWithRouter(<Hero />);

    // Vérifier que les boutons CTA sont présents
    expect(screen.getByText('hero.cta.primary')).toBeInTheDocument();
    expect(screen.getByText('hero.cta.secondary')).toBeInTheDocument();
  });

  test('renders testimonials section', () => {
    renderWithRouter(<Hero />);

    // Vérifier que la section de témoignages est présente
    expect(screen.getByText('hero.testimonials.title')).toBeInTheDocument();
    expect(screen.getByText('hero.testimonials.subtitle')).toBeInTheDocument();
  });

  test('renders video player', () => {
    renderWithRouter(<Hero />);

    // Vérifier que la vidéo est présente
    const videoElement = screen.getByText(/Votre navigateur ne prend pas en charge la lecture de vidéos./i);
    expect(videoElement).toBeInTheDocument();
  });
});
