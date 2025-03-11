import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

describe('Button Component', () => {
  test('renders button with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary-500'); // Default primary variant
    expect(button).not.toHaveClass('w-full'); // Not full width by default
  });

  test('renders button with primary variant', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button', { name: /primary/i });

    expect(button).toHaveClass('bg-primary-500');
    expect(button).toHaveClass('hover:bg-primary-600');
  });

  test('renders button with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: /secondary/i });

    expect(button).toHaveClass('bg-secondary-500');
    expect(button).toHaveClass('hover:bg-secondary-600');
  });

  test('renders button with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button', { name: /outline/i });

    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-primary-500');
    expect(button).toHaveClass('text-primary-500');
  });

  test('renders full width button', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button', { name: /full width/i });

    expect(button).toHaveClass('w-full');
  });

  test('renders disabled button', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });

    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-70');
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });

  test('renders loading button', () => {
    render(<Button isLoading>Loading</Button>);

    // Le texte "Loading" est masqué lorsque isLoading est true
    const loadingText = screen.queryByText('Loading');
    expect(loadingText).not.toBeInTheDocument();

    // Mais le spinner est visible
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    // Et le texte "Chargement..." est présent pour l'accessibilité
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  test('renders with start icon', () => {
    render(
      <Button startIcon={<span data-testid="start-icon">🔍</span>}>
        Search
      </Button>
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('renders with end icon', () => {
    render(
      <Button endIcon={<span data-testid="end-icon">→</span>}>
        Next
      </Button>
    );

    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
