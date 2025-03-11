import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestimonialSlider from '../TestimonialSlider';
import { TestimonialProps } from '../Testimonial';

// Mock des intervalles pour les tests
jest.useFakeTimers();

// Mock de matchMedia pour simuler les media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false, // Simuler un écran mobile
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('TestimonialSlider Component', () => {
  // Données de test
  const mockTestimonials: TestimonialProps[] = [
    {
      content: 'Testimonial 1',
      author: {
        name: 'John Doe',
        title: 'CEO',
        company: 'Company A'
      },
      rating: 5
    },
    {
      content: 'Testimonial 2',
      author: {
        name: 'Jane Smith',
        title: 'CTO',
        company: 'Company B'
      },
      rating: 4
    },
    {
      content: 'Testimonial 3',
      author: {
        name: 'Bob Johnson',
        title: 'Designer',
        company: 'Company C'
      },
      rating: 3
    }
  ];

  // Réinitialiser les mocks après chaque test
  afterEach(() => {
    jest.clearAllTimers();
  });

  test('renders nothing when no testimonials are provided', () => {
    const { container } = render(<TestimonialSlider testimonials={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders a single testimonial without controls when only one is provided', () => {
    render(<TestimonialSlider testimonials={[mockTestimonials[0]]} />);

    // Vérifier que le contenu du témoignage est affiché
    expect(screen.getByText('Testimonial 1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Vérifier que les contrôles de navigation ne sont pas affichés
    expect(screen.queryByLabelText('Témoignage précédent')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Témoignage suivant')).not.toBeInTheDocument();
  });

  test('renders multiple testimonials with navigation controls', () => {
    const { container } = render(<TestimonialSlider testimonials={mockTestimonials} />);

    // Vérifier que les contrôles de navigation sont affichés
    expect(screen.getByLabelText('Témoignage précédent')).toBeInTheDocument();
    expect(screen.getByLabelText('Témoignage suivant')).toBeInTheDocument();

    // Vérifier que les indicateurs de pagination sont affichés
    const paginationButtons = screen.getAllByRole('button').filter(
      button => button.getAttribute('aria-label')?.includes('Aller au témoignage')
    );
    expect(paginationButtons.length).toBe(3); // Un pour chaque témoignage

    // Vérifier que le slider est présent
    const sliderContainer = container.querySelector('.overflow-hidden');
    expect(sliderContainer).toBeInTheDocument();
  });

  test('navigates to the next testimonial when next button is clicked', () => {
    render(<TestimonialSlider testimonials={mockTestimonials} autoPlay={false} />);

    // Cliquer sur le bouton suivant
    fireEvent.click(screen.getByLabelText('Témoignage suivant'));

    // Vérifier que le deuxième indicateur de pagination est actif
    const paginationButtons = screen.getAllByRole('button').filter(
      button => button.getAttribute('aria-label')?.includes('Aller au témoignage')
    );
    expect(paginationButtons[1]).toHaveClass('bg-primary-500');
  });

  test('navigates to the previous testimonial when previous button is clicked', () => {
    render(<TestimonialSlider testimonials={mockTestimonials} autoPlay={false} />);

    // Aller au deuxième témoignage
    fireEvent.click(screen.getByLabelText('Témoignage suivant'));

    // Cliquer sur le bouton précédent
    fireEvent.click(screen.getByLabelText('Témoignage précédent'));

    // Vérifier que le premier indicateur de pagination est actif
    const paginationButtons = screen.getAllByRole('button').filter(
      button => button.getAttribute('aria-label')?.includes('Aller au témoignage')
    );
    expect(paginationButtons[0]).toHaveClass('bg-primary-500');
  });

  test('navigates to a specific testimonial when pagination indicator is clicked', () => {
    render(<TestimonialSlider testimonials={mockTestimonials} autoPlay={false} />);

    // Trouver les indicateurs de pagination
    const paginationButtons = screen.getAllByRole('button').filter(
      button => button.getAttribute('aria-label')?.includes('Aller au témoignage')
    );

    // Cliquer sur le troisième indicateur
    fireEvent.click(paginationButtons[2]);

    // Vérifier que le troisième indicateur est actif
    expect(paginationButtons[2]).toHaveClass('bg-primary-500');
  });

  test('auto-plays to the next testimonial after interval', () => {
    render(<TestimonialSlider testimonials={mockTestimonials} autoPlay={true} autoPlayInterval={5000} />);

    // Trouver les indicateurs de pagination
    const paginationButtons = screen.getAllByRole('button').filter(
      button => button.getAttribute('aria-label')?.includes('Aller au témoignage')
    );

    // Vérifier que le premier indicateur est actif
    expect(paginationButtons[0]).toHaveClass('bg-primary-500');

    // Avancer le temps de 5 secondes
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Vérifier que le deuxième indicateur est maintenant actif
    expect(paginationButtons[1]).toHaveClass('bg-primary-500');
  });

  test('applies custom className to the container', () => {
    const { container } = render(
      <TestimonialSlider testimonials={mockTestimonials} className="custom-class" />
    );

    // Vérifier que la classe personnalisée est appliquée au conteneur
    expect(container.firstChild).toHaveClass('custom-class', { exact: false });
  });
});
