import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import Button from '../Button';
import theme from '../../../styles/theme';

// Helper pour rendre le composant avec le ThemeProvider
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Button Component', () => {
  test('renders correctly with default props', () => {
    renderWithTheme(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('applies different variants correctly', () => {
    const { rerender } = renderWithTheme(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button', { name: /primary/i });
    expect(button).toHaveStyle('background-color: #4F46E5'); // primary color

    rerender(
      <ThemeProvider theme={theme}>
        <Button variant="secondary">Secondary</Button>
      </ThemeProvider>
    );
    button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveStyle('background-color: #10B981'); // secondary color

    rerender(
      <ThemeProvider theme={theme}>
        <Button variant="outlined">Outlined</Button>
      </ThemeProvider>
    );
    button = screen.getByRole('button', { name: /outlined/i });
    expect(button).toHaveStyle('background-color: transparent');
    expect(button).toHaveStyle('border: 1px solid #4F46E5');

    rerender(
      <ThemeProvider theme={theme}>
        <Button variant="text">Text</Button>
      </ThemeProvider>
    );
    button = screen.getByRole('button', { name: /text/i });
    expect(button).toHaveStyle('background-color: transparent');
    expect(button).toHaveStyle('border: none');
  });

  test('applies different sizes correctly', () => {
    const { rerender } = renderWithTheme(<Button size="small">Small</Button>);
    let button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveStyle('font-size: 0.875rem');

    rerender(
      <ThemeProvider theme={theme}>
        <Button size="medium">Medium</Button>
      </ThemeProvider>
    );
    button = screen.getByRole('button', { name: /medium/i });
    expect(button).toHaveStyle('font-size: 1rem');

    rerender(
      <ThemeProvider theme={theme}>
        <Button size="large">Large</Button>
      </ThemeProvider>
    );
    button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveStyle('font-size: 1.125rem');
  });

  test('applies fullWidth prop correctly', () => {
    renderWithTheme(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button', { name: /full width/i });
    expect(button).toHaveStyle('width: 100%');
  });

  test('handles disabled state correctly', () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  test('handles loading state correctly', () => {
    renderWithTheme(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  test('renders with start and end icons', () => {
    renderWithTheme(
      <Button
        startIcon={<span data-testid="start-icon">Start</span>}
        endIcon={<span data-testid="end-icon">End</span>}
      >
        With Icons
      </Button>
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icons')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
