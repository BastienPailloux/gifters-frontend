import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  test('renders children correctly', () => {
    render(
      <Card>
        <p data-testid="card-content">Card Content</p>
      </Card>
    );

    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  test('applies different variants correctly', () => {
    const { rerender } = render(
      <Card variant="default" data-testid="card">
        Default Card
      </Card>
    );

    let card = screen.getByTestId('card');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('shadow-sm');

    rerender(
      <Card variant="outlined" data-testid="card">
        Outlined Card
      </Card>
    );

    card = screen.getByTestId('card');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-gray-200');

    rerender(
      <Card variant="elevated" data-testid="card">
        Elevated Card
      </Card>
    );

    card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-soft');
  });

  test('applies different padding correctly', () => {
    const { rerender } = render(
      <Card padding="none" data-testid="card">
        No Padding
      </Card>
    );

    let card = screen.getByTestId('card');
    expect(card).toHaveClass('p-0');

    rerender(
      <Card padding="sm" data-testid="card">
        Small Padding
      </Card>
    );

    card = screen.getByTestId('card');
    expect(card).toHaveClass('p-3');

    rerender(
      <Card padding="md" data-testid="card">
        Medium Padding
      </Card>
    );

    card = screen.getByTestId('card');
    expect(card).toHaveClass('p-4');

    rerender(
      <Card padding="lg" data-testid="card">
        Large Padding
      </Card>
    );

    card = screen.getByTestId('card');
    expect(card).toHaveClass('p-6');
  });

  test('applies fullWidth prop correctly', () => {
    render(
      <Card fullWidth data-testid="card">
        Full Width Card
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('w-full');
  });

  test('passes className prop correctly', () => {
    render(
      <Card className="custom-class" data-testid="card">
        Card with Custom Class
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class');
  });
});
