import { render, screen, fireEvent } from '@testing-library/react';
import Image from '../Image';

describe('Image Component', () => {
  test('renders image with default props', () => {
    render(<Image src="/test-image.jpg" alt="Test image" />);

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');

    // Le conteneur parent doit avoir les classes par défaut
    const container = image.parentElement;
    expect(container).toHaveClass('overflow-hidden');
  });

  test('applies correct style classes based on props', () => {
    render(
      <Image
        src="/test-image.jpg"
        alt="Test image"
        objectFit="cover"
        aspectRatio="square"
        rounded
        bordered
        hasShadow
        className="custom-image-class"
        containerClassName="custom-container-class"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveClass('object-cover');
    expect(image).toHaveClass('custom-image-class');

    const container = image.parentElement;
    expect(container).not.toBeNull();
    expect(container).toHaveClass('aspect-square');
    expect(container).toHaveClass('rounded-lg');
    expect(container).toHaveClass('border');
    expect(container).toHaveClass('border-gray-200');
    expect(container).toHaveClass('shadow-md');
    expect(container).toHaveClass('custom-container-class');
  });

  test('handles image load error', () => {
    render(
      <Image
        src="/non-existent-image.jpg"
        alt="Non-existent image"
        fallbackSrc="/fallback-image.jpg"
      />
    );

    const image = screen.getByAltText('Non-existent image');

    // Simuler une erreur de chargement d'image
    fireEvent.error(image);

    // Vérifier que l'image a été remplacée par le fallback
    expect(image).toHaveAttribute('src', '/fallback-image.jpg');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <Image
        src="/test-image.jpg"
        alt="Clickable image"
        onClick={handleClick}
      />
    );

    const image = screen.getByAltText('Clickable image');
    const container = image.parentElement;

    expect(container).not.toBeNull();
    if (container) {
      expect(container).toHaveClass('cursor-pointer');
      // Cliquer sur l'image
      fireEvent.click(container);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  test('handles different aspect ratios', () => {
    const { rerender } = render(
      <Image src="/test-image.jpg" alt="Test image" aspectRatio="16/9" />
    );

    let image = screen.getByAltText('Test image');
    let container = image.parentElement;

    expect(container).not.toBeNull();
    if (container) {
      expect(container).toHaveClass('aspect-video');
    }

    rerender(<Image src="/test-image.jpg" alt="Test image" aspectRatio="4/3" />);

    image = screen.getByAltText('Test image');
    container = image.parentElement;

    expect(container).not.toBeNull();
    if (container) {
      expect(container).toHaveClass('aspect-4/3');
    }
  });
});
