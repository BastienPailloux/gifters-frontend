import React, { useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import useKeyPress from '../useKeyPress';

// Composant de test qui utilise le hook
const TestComponent: React.FC<{
  onEnter: () => void;
  onEscape?: () => void;
  targetRef?: boolean;
  active?: boolean;
}> = ({ onEnter, onEscape, targetRef = false, active = true }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Définir les gestionnaires de touches
  const handlers = {
    Enter: onEnter,
    ...(onEscape && { Escape: onEscape }),
  };

  // Utiliser le hook avec ou sans référence selon les props
  useKeyPress(handlers, targetRef ? inputRef : undefined, active);

  return (
    <div>
      <input
        ref={inputRef}
        data-testid="test-input"
        placeholder="Test Input"
      />
      <button data-testid="test-button">Test Button</button>
    </div>
  );
};

describe('useKeyPress Hook', () => {
  it('handles Enter key press on document', () => {
    const handleEnter = jest.fn();
    render(<TestComponent onEnter={handleEnter} />);

    // Simuler l'appui sur Entrée au niveau du document
    fireEvent.keyDown(document, { key: 'Enter' });

    // Vérifier que le gestionnaire a été appelé
    expect(handleEnter).toHaveBeenCalledTimes(1);
  });

  it('handles Escape key press on document', () => {
    const handleEscape = jest.fn();
    render(<TestComponent onEnter={jest.fn()} onEscape={handleEscape} />);

    // Simuler l'appui sur Escape au niveau du document
    fireEvent.keyDown(document, { key: 'Escape' });

    // Vérifier que le gestionnaire a été appelé
    expect(handleEscape).toHaveBeenCalledTimes(1);
  });

  it('handles key press on specific element when targetRef is provided', () => {
    const handleEnter = jest.fn();
    render(<TestComponent onEnter={handleEnter} targetRef={true} />);

    // Récupérer l'élément input
    const input = screen.getByTestId('test-input');

    // Simuler l'appui sur Entrée sur l'input spécifique
    fireEvent.keyDown(input, { key: 'Enter' });

    // Vérifier que le gestionnaire a été appelé
    expect(handleEnter).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when hook is not active', () => {
    const handleEnter = jest.fn();
    render(<TestComponent onEnter={handleEnter} active={false} />);

    // Simuler l'appui sur Entrée
    fireEvent.keyDown(document, { key: 'Enter' });

    // Vérifier que le gestionnaire n'a pas été appelé
    expect(handleEnter).not.toHaveBeenCalled();
  });

  it('does not call handler for unregistered keys', () => {
    const handleEnter = jest.fn();
    render(<TestComponent onEnter={handleEnter} />);

    // Simuler l'appui sur une touche non gérée
    fireEvent.keyDown(document, { key: 'a' });

    // Vérifier que le gestionnaire n'a pas été appelé
    expect(handleEnter).not.toHaveBeenCalled();
  });
});
