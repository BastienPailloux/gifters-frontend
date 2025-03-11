import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../Card';

describe('Card Component', () => {
  test('renders card with default props', () => {
    render(<Card>Card Content</Card>);

    expect(screen.getByText('Card Content')).toBeInTheDocument();
    // Vérifier les classes de base
    const card = screen.getByText('Card Content').closest('div.bg-white');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('overflow-hidden');
    expect(card).toHaveClass('shadow');
    expect(card).toHaveClass('rounded-lg');
  });

  test('renders card with title and subtitle', () => {
    render(
      <Card
        title="Card Title"
        subtitle="Card Subtitle"
      >
        Card Content
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();

    // Vérifier que le titre est dans un h3
    const title = screen.getByText('Card Title');
    expect(title.tagName).toBe('H3');

    // Vérifier que le sous-titre est dans un paragraphe
    const subtitle = screen.getByText('Card Subtitle');
    expect(subtitle.tagName).toBe('P');
  });

  test('renders card with footer', () => {
    render(
      <Card
        footer={<div>Card Footer</div>}
      >
        Card Content
      </Card>
    );

    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();

    // Le footer parent doit avoir la classe bg-gray-50, pas le div enfant
    const footer = screen.getByText('Card Footer').parentElement;
    expect(footer).toHaveClass('bg-gray-50');
  });

  test('renders card with elevated variant', () => {
    render(<Card variant="elevated">Card Content</Card>);

    const card = screen.getByText('Card Content').closest('div.bg-white');
    expect(card).toHaveClass('shadow-md');
  });

  test('renders card with outlined variant', () => {
    render(<Card variant="outlined">Card Content</Card>);

    const card = screen.getByText('Card Content').closest('div.bg-white');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-gray-200');
    expect(card).toHaveClass('shadow-sm');
  });

  test('renders card with filled variant', () => {
    const { container } = render(<Card variant="filled">Card Content</Card>);

    // Utiliser le conteneur racine pour cibler le div principal
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-gray-50');
  });


  test('renders hoverable card', () => {
    render(<Card hoverable>Card Content</Card>);

    const card = screen.getByText('Card Content').closest('div.bg-white');
    expect(card).toHaveClass('transition-transform');
    expect(card).toHaveClass('hover:scale-105');
    expect(card).toHaveClass('cursor-pointer');
  });

  test('calls onClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Card Content</Card>);

    fireEvent.click(screen.getByText('Card Content').closest('div.bg-white') as HTMLElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies additional className to card', () => {
    render(<Card className="test-class">Card Content</Card>);

    const card = screen.getByText('Card Content').closest('div.bg-white');
    expect(card).toHaveClass('test-class');
  });

  test('applies additional className to title section', () => {
    render(
      <Card
        title="Card Title"
        titleClassName="test-title-class"
      >
        Card Content
      </Card>
    );

    const titleSection = screen.getByText('Card Title').closest('div');
    expect(titleSection).toHaveClass('test-title-class');
  });

  test('applies additional className to body section', () => {
    render(
      <Card
        bodyClassName="test-body-class"
      >
        Card Content
      </Card>
    );

    const bodySection = screen.getByText('Card Content').closest('div');
    expect(bodySection).toHaveClass('test-body-class');
  });

  test('applies additional className to footer section', () => {
    render(
      <Card
        footer={<div>Card Footer</div>}
        footerClassName="test-footer-class"
      >
        Card Content
      </Card>
    );

    // Le footer parent doit avoir la classe test-footer-class, pas le div enfant
    const footerSection = screen.getByText('Card Footer').parentElement;
    expect(footerSection).toHaveClass('test-footer-class');
  });
});
