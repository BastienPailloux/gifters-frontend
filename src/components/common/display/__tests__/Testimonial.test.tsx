import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Testimonial from '../Testimonial';

describe('Testimonial Component', () => {
  const mockTestimonial = {
    content: 'This is a great product!',
    author: {
      name: 'John Doe',
      title: 'CEO',
      company: 'Test Company',
      avatarUrl: 'https://example.com/avatar.jpg'
    },
    rating: 4
  };

  test('renders testimonial with all props', () => {
    render(<Testimonial {...mockTestimonial} />);

    // Contenu
    expect(screen.getByText(mockTestimonial.content)).toBeInTheDocument();

    // Auteur - nom
    expect(screen.getByText(mockTestimonial.author.name)).toBeInTheDocument();

    // Auteur - titre et entreprise
    expect(screen.getByText(/CEO, Test Company/i)).toBeInTheDocument();

    // Avatar
    const avatar = screen.getByAltText(`Photo de ${mockTestimonial.author.name}`);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockTestimonial.author.avatarUrl);

    // Étoiles
    const stars = screen.getAllByTestId('star');
    expect(stars).toHaveLength(5);

    // 4 étoiles pleines, 1 étoile vide pour un rating de 4
    const fullStars = stars.filter(star => star.classList.contains('text-yellow-400'));
    const emptyStars = stars.filter(star => star.classList.contains('text-gray-300'));
    expect(fullStars).toHaveLength(4);
    expect(emptyStars).toHaveLength(1);
  });

  test('renders testimonial without avatar URL (uses initial instead)', () => {
    const testimonialWithoutAvatar = {
      content: 'This is a great product!',
      author: {
        name: 'Jane Smith',
        title: 'Designer'
      },
      rating: 5
    };

    render(<Testimonial {...testimonialWithoutAvatar} />);

    // Vérifier l'initiale au lieu de l'avatar
    const initial = screen.getByText('J');
    expect(initial).toBeInTheDocument();

    // Vérifier que l'avatar n'est pas présent
    const avatar = screen.queryByAltText(`Photo de ${testimonialWithoutAvatar.author.name}`);
    expect(avatar).not.toBeInTheDocument();
  });

  test('renders testimonial with only author name (no title/company)', () => {
    const minimalTestimonial = {
      content: 'Simple testimonial',
      author: {
        name: 'John Doe'
      }
    };

    render(<Testimonial {...minimalTestimonial} />);

    expect(screen.getByText(minimalTestimonial.content)).toBeInTheDocument();
    expect(screen.getByText(minimalTestimonial.author.name)).toBeInTheDocument();

    // Vérifier que le titre et l'entreprise ne sont pas présents
    const titleAndCompany = screen.queryByText(/CEO/i);
    expect(titleAndCompany).not.toBeInTheDocument();
  });

  test('renders testimonial with default rating (5 stars)', () => {
    const testimonialWithoutRating = {
      content: 'This is a great product!',
      author: {
        name: 'John Doe'
      }
    };

    render(<Testimonial {...testimonialWithoutRating} />);

    // Vérifier les étoiles
    const stars = screen.getAllByTestId('star');
    expect(stars).toHaveLength(5);

    // Toutes les étoiles doivent être pleines pour un rating par défaut de 5
    const fullStars = stars.filter(star => star.classList.contains('text-yellow-400'));
    expect(fullStars).toHaveLength(5);
  });

  test('renders testimonial with custom className', () => {
    const { container } = render(
      <Testimonial
        content="Content"
        author={{ name: 'Author' }}
        className="custom-class"
      />
    );

    // Trouver le conteneur principal du témoignage (premier enfant du conteneur)
    const testimonialContainer = container.firstChild;
    expect(testimonialContainer).toHaveClass('custom-class', { exact: false });
  });
});
