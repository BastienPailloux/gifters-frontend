import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock des hooks et contextes
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock du contexte d'authentification
const mockLogin = jest.fn().mockResolvedValue({ success: true });
const mockClearError = jest.fn();

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    error: null,
    clearError: mockClearError,
  }),
}));

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Vérifier que les éléments du formulaire sont présents
    expect(screen.getByText('auth.login.title')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.fields.email')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.fields.password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'auth.login.submit' })).toBeInTheDocument();
    expect(screen.getByText('auth.login.registerLink')).toBeInTheDocument();
  });

  it('submits the form with email and password', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText('auth.fields.email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('auth.fields.password'), {
      target: { value: 'password123' },
    });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: 'auth.login.submit' }));

    // Vérifier que la fonction de connexion a été appelée avec les bonnes valeurs
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    // Vérifier la redirection
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message when login fails', async () => {
    // Modifier le mock pour simuler une erreur
    jest.mock('../../../contexts/AuthContext', () => ({
      useAuth: () => ({
        login: jest.fn().mockResolvedValue({ success: false }),
        error: 'auth.errors.login',
        clearError: jest.fn(),
      }),
    }));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Vérifier que le message d'erreur est affiché
    expect(screen.getByText('auth.errors.login')).toBeInTheDocument();
  });
});
