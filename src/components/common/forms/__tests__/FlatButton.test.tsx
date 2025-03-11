import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import FlatButton from '../FlatButton';

// Wrapper pour les tests avec Link
const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('FlatButton Component', () => {
  test('renders button with default props', () => {
    render(<FlatButton>Click me</FlatButton>);
    const button = screen.getByRole('button', { name: /click me/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('text-indigo-600'); // Default primary variant
    expect(button).toHaveClass('text-sm'); // Default medium size
  });

  test('renders button with primary variant', () => {
    render(<FlatButton variant="primary">Primary</FlatButton>);
    const button = screen.getByRole('button', { name: /primary/i });

    expect(button).toHaveClass('text-indigo-600');
    expect(button).toHaveClass('hover:text-indigo-800');
  });

  test('renders button with secondary variant', () => {
    render(<FlatButton variant="secondary">Secondary</FlatButton>);
    const button = screen.getByRole('button', { name: /secondary/i });

    expect(button).toHaveClass('text-gray-600');
    expect(button).toHaveClass('hover:text-gray-800');
  });

  test('renders button with danger variant', () => {
    render(<FlatButton variant="danger">Danger</FlatButton>);
    const button = screen.getByRole('button', { name: /danger/i });

    expect(button).toHaveClass('text-red-600');
    expect(button).toHaveClass('hover:text-red-800');
  });

  test('renders button with small size', () => {
    render(<FlatButton size="small">Small</FlatButton>);
    const button = screen.getByRole('button', { name: /small/i });

    expect(button).toHaveClass('text-xs');
    expect(button).toHaveClass('gap-1');
  });

  test('renders button with large size', () => {
    render(<FlatButton size="large">Large</FlatButton>);
    const button = screen.getByRole('button', { name: /large/i });

    expect(button).toHaveClass('text-base');
    expect(button).toHaveClass('gap-2');
  });

  test('renders disabled button', () => {
    render(<FlatButton disabled>Disabled</FlatButton>);
    const button = screen.getByRole('button', { name: /disabled/i });

    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });

  test('renders with no underline', () => {
    render(<FlatButton underline="none">No Underline</FlatButton>);
    const button = screen.getByRole('button', { name: /no underline/i });

    expect(button).not.toHaveClass('underline');
    expect(button).not.toHaveClass('hover:underline');
  });

  test('renders with hover underline', () => {
    render(<FlatButton underline="hover">Hover Underline</FlatButton>);
    const button = screen.getByRole('button', { name: /hover underline/i });

    expect(button).toHaveClass('hover:underline');
    expect(button).not.toHaveClass('underline');
  });

  test('renders with always underline', () => {
    render(<FlatButton underline="always">Always Underline</FlatButton>);
    const button = screen.getByRole('button', { name: /always underline/i });

    expect(button).toHaveClass('underline');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<FlatButton onClick={handleClick}>Click me</FlatButton>);

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders as a link with href', () => {
    renderWithRouter(<FlatButton asLink href="/test">Link</FlatButton>);

    const link = screen.getByRole('link', { name: /link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  test('renders with left icon', () => {
    render(
      <FlatButton
        icon={<span data-testid="test-icon">🔍</span>}
        iconPosition="left"
      >
        With Icon
      </FlatButton>
    );

    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();

    // L'icône doit être avant le texte
    const button = screen.getByRole('button');
    expect(button.firstChild).toContainElement(icon);
  });

  test('renders with right icon', () => {
    render(
      <FlatButton
        icon={<span data-testid="test-icon">→</span>}
        iconPosition="right"
      >
        With Icon
      </FlatButton>
    );

    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();

    // L'icône doit être après le texte
    const button = screen.getByRole('button');
    expect(button.lastChild).toContainElement(icon);
  });
});
