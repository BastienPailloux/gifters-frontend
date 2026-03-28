import React from 'react';
import { render, screen } from '@testing-library/react';
import ThinkingSteps from '../ThinkingSteps';
import { ThinkingStep } from '../../../types/chat';

const step = (overrides: Partial<ThinkingStep> = {}): ThinkingStep => ({
  id: '1',
  label: 'Connexion MCP',
  status: 'running',
  ...overrides,
});

describe('ThinkingSteps', () => {
  it('affiche les labels des étapes', () => {
    render(<ThinkingSteps steps={[step({ label: 'Chargement' })]} />);
    expect(screen.getByText('Chargement')).toBeInTheDocument();
  });

  it('affiche le spinner pour une étape "running"', () => {
    render(<ThinkingSteps steps={[step({ status: 'running' })]} />);
    expect(screen.getByRole('img', { name: /en cours/i })).toBeInTheDocument();
  });

  it('affiche ✓ pour une étape "done"', () => {
    render(<ThinkingSteps steps={[step({ status: 'done' })]} />);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('ne rend rien si la liste est vide', () => {
    const { container } = render(<ThinkingSteps steps={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('affiche plusieurs étapes', () => {
    const steps: ThinkingStep[] = [
      { id: '1', label: 'Étape 1', status: 'done' },
      { id: '2', label: 'Étape 2', status: 'running' },
    ];
    render(<ThinkingSteps steps={steps} />);
    expect(screen.getByText('Étape 1')).toBeInTheDocument();
    expect(screen.getByText('Étape 2')).toBeInTheDocument();
  });
});
