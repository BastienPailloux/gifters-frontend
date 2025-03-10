import React from 'react';
import { render, screen } from '@testing-library/react';
import Testimonial from '../Testimonial';

describe('Testimonial Component', () => {
  const defaultProps = {
    content: "C'est un excellent service !",
    author: {
      name: "Jean Dupont",
      title: "Développeur",
      company: "Tech Co",
    },
    rating: 4
  };

  test('renders testimonial content correctly', () => {
    render(<Testimonial {...defaultProps} />);

    // Vérifier que le contenu du témoignage est affiché
    expect(screen.getByText("C'est un excellent service !")).toBeInTheDocument();

    // Vérifier que le nom de l'auteur est affiché
    expect(screen.getByText("Jean Dupont")).toBeInTheDocument();

    // Vérifier que le titre et l'entreprise sont affichés
    expect(screen.getByText("Développeur, Tech Co")).toBeInTheDocument();
  });

  test('renders avatar placeholder when no avatarUrl is provided', () => {
    render(<Testimonial {...defaultProps} />);

    // Vérifier que l'initiale de l'auteur est affichée comme avatar par défaut
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  test('renders avatar image when avatarUrl is provided', () => {
    const propsWithAvatar = {
      ...defaultProps,
      author: {
        ...defaultProps.author,
        avatarUrl: "https://example.com/avatar.jpg"
      }
    };

    render(<Testimonial {...propsWithAvatar} />);

    // Vérifier que l'image de l'avatar est affichée
    const avatarImg = screen.getByAltText(`Photo de ${propsWithAvatar.author.name}`);
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg).toHaveAttribute('src', propsWithAvatar.author.avatarUrl);
  });

  test('renders correct number of stars based on rating', () => {
    render(<Testimonial {...defaultProps} />);

    // Récupérer toutes les étoiles
    const stars = screen.getAllByTestId('star');
    expect(stars).toHaveLength(5);

    // Vérifier que 4 étoiles sont pleines (jaunes) et 1 est vide (grise)
    const fullStars = stars.filter(star => star.classList.contains('text-yellow-400'));
    const emptyStars = stars.filter(star => star.classList.contains('text-gray-300'));

    expect(fullStars).toHaveLength(4);
    expect(emptyStars).toHaveLength(1);

    // Vérifier les attributs aria-label
    expect(stars[0]).toHaveAttribute('aria-label', 'Étoile pleine');
    expect(stars[1]).toHaveAttribute('aria-label', 'Étoile pleine');
    expect(stars[2]).toHaveAttribute('aria-label', 'Étoile pleine');
    expect(stars[3]).toHaveAttribute('aria-label', 'Étoile pleine');
    expect(stars[4]).toHaveAttribute('aria-label', 'Étoile vide');
  });

  test('applies custom className when provided', () => {
    const customClass = 'custom-testimonial-class';
    render(<Testimonial {...defaultProps} className={customClass} />);

    // Vérifier que la classe personnalisée est appliquée
    const testimonialElement = screen.getByText("C'est un excellent service !").closest('div');
    expect(testimonialElement?.parentElement).toHaveClass(customClass);
  });
});
