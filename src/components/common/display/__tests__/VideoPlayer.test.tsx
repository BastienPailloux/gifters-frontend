import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoPlayer from '../VideoPlayer';

// Mock des fonctions de l'élément vidéo
const playMock = jest.fn();
const pauseMock = jest.fn();

// Mock de l'élément vidéo
HTMLMediaElement.prototype.play = playMock;
HTMLMediaElement.prototype.pause = pauseMock;

describe('VideoPlayer Component', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    playMock.mockReset();
    pauseMock.mockReset();
  });

  test('renders video player with default props', () => {
    const { container } = render(<VideoPlayer src="video.mp4" />);

    // Vérifier que l'élément vidéo est présent
    const videoElement = container.querySelector('video');
    expect(videoElement).toBeInTheDocument();

    // Vérifier les propriétés par défaut (au lieu des attributs)
    expect(videoElement).toHaveProperty('autoplay', true);
    expect(videoElement).toHaveProperty('muted', true);
    expect(videoElement).toHaveProperty('loop', true);
    expect(videoElement).toHaveProperty('controls', false);

    // Vérifier la source
    const sourceElement = container.querySelector('source');
    expect(sourceElement).toHaveAttribute('src', 'video.mp4');
    expect(sourceElement).toHaveAttribute('type', 'video/mp4');
  });

  test('renders video player with custom props', () => {
    const { container } = render(
      <VideoPlayer
        src="video.webm"
        poster="poster.jpg"
        autoPlay={false}
        muted={false}
        loop={false}
        controls={true}
        className="custom-class"
      />
    );

    const videoElement = container.querySelector('video');

    // Vérifier les propriétés personnalisées
    expect(videoElement).toHaveProperty('autoplay', false);
    expect(videoElement).toHaveProperty('muted', false);
    expect(videoElement).toHaveProperty('loop', false);
    expect(videoElement).toHaveProperty('controls', true);
    expect(videoElement).toHaveAttribute('poster', 'poster.jpg');

    // Vérifier la source
    const sourceElement = container.querySelector('source');
    expect(sourceElement).toHaveAttribute('src', 'video.webm');
    expect(sourceElement).toHaveAttribute('type', 'video/webm');

    // Vérifier la classe personnalisée
    expect(container.firstChild).toHaveClass('custom-class', { exact: false });
  });

  test('renders fallback image when video has error', () => {
    // Simuler une erreur de chargement de vidéo
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const { container, rerender } = render(
      <VideoPlayer
        src="invalid-video.mp4"
        fallbackImage="fallback.jpg"
      />
    );

    // Simuler une erreur de vidéo
    const videoElement = container.querySelector('video');
    fireEvent.error(videoElement!);

    // Re-render pour que l'état d'erreur soit pris en compte
    rerender(
      <VideoPlayer
        src="invalid-video.mp4"
        fallbackImage="fallback.jpg"
      />
    );

    // Vérifier que l'image de fallback est affichée
    const imgElement = container.querySelector('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'fallback.jpg');
    expect(imgElement).toHaveAttribute('alt', 'Vidéo non disponible');

    // Vérifier que l'élément vidéo n'est plus présent
    expect(container.querySelector('video')).not.toBeInTheDocument();
  });

  test('toggles play/pause when clicked', () => {
    const { container } = render(<VideoPlayer src="video.mp4" autoPlay={false} />);

    const videoElement = container.querySelector('video');

    // Cliquer sur la vidéo pour lancer la lecture
    fireEvent.click(videoElement!);
    expect(playMock).toHaveBeenCalledTimes(1);

    // Cliquer à nouveau pour mettre en pause
    fireEvent.click(videoElement!);
    expect(pauseMock).toHaveBeenCalledTimes(1);
  });

  test('applies correct aspect ratio class', () => {
    // Test pour le ratio 16:9 (par défaut)
    const { container, rerender } = render(<VideoPlayer src="video.mp4" />);
    expect(container.firstChild).toHaveClass('aspect-video', { exact: false });

    // Test pour le ratio 4:3
    rerender(<VideoPlayer src="video.mp4" aspectRatio="4/3" />);
    expect(container.firstChild).toHaveClass('aspect-[4/3]', { exact: false });

    // Test pour le ratio 1:1
    rerender(<VideoPlayer src="video.mp4" aspectRatio="1/1" />);
    expect(container.firstChild).toHaveClass('aspect-square', { exact: false });

    // Test pour le ratio 21:9
    rerender(<VideoPlayer src="video.mp4" aspectRatio="21/9" />);
    expect(container.firstChild).toHaveClass('aspect-[21/9]', { exact: false });
  });

  test('shows play button overlay when paused and not using controls', () => {
    const { container } = render(<VideoPlayer src="video.mp4" autoPlay={false} controls={false} />);

    // Vérifier que l'overlay est présent
    const overlay = container.querySelector('.absolute.inset-0');
    expect(overlay).toBeInTheDocument();

    // Vérifier que l'icône de lecture est présente
    const playIcon = container.querySelector('svg');
    expect(playIcon).toBeInTheDocument();

    // Cliquer sur l'overlay pour lancer la lecture
    fireEvent.click(overlay!);
    expect(playMock).toHaveBeenCalledTimes(1);
  });

  test('does not show overlay when controls are enabled', () => {
    const { container } = render(<VideoPlayer src="video.mp4" controls={true} />);

    // Vérifier que l'overlay n'est pas présent
    const overlay = container.querySelector('.absolute.inset-0');
    expect(overlay).not.toBeInTheDocument();
  });
});
