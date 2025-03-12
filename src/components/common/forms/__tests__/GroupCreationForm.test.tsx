import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GroupCreationForm from '../GroupCreationForm';
import { groupService } from '../../../../services/api';

// Déclarer mockKeyHandlers dans le global
declare global {
  // eslint-disable-next-line no-var
  var mockKeyHandlers: Record<string, () => void>;
}

// Mock des dépendances
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'sidemenu.createGroup': 'Create Group',
        'sidemenu.groupNamePlaceholder': 'Enter group name...',
        'common.error': 'An error occurred',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../../../services/api', () => ({
  groupService: {
    createGroup: jest.fn(),
  },
}));

// Mock des hooks personnalisés
jest.mock('../../../../hooks/useOutsideClick', () => jest.fn());
jest.mock('../../../../hooks/useKeyPress', () =>
  // Implémentation simulée qui stocke les gestionnaires pour les tests
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jest.fn((handlers, _ref, _active) => {
    // Stocker les gestionnaires pour les tests
    global.mockKeyHandlers = handlers;
  })
);

// Mock pour document.dispatchEvent
const mockDispatchEvent = jest.fn();
document.dispatchEvent = mockDispatchEvent;

describe('GroupCreationForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock l'implémentation par défaut de createGroup
    (groupService.createGroup as jest.Mock).mockResolvedValue({});
    // Réinitialiser les gestionnaires mockés
    global.mockKeyHandlers = {};
  });

  it('renders the button initially and not the input', () => {
    render(<GroupCreationForm />);

    expect(screen.getByText('Create Group')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter group name...')).not.toBeInTheDocument();
  });

  it('shows input when button is clicked', () => {
    render(<GroupCreationForm />);

    fireEvent.click(screen.getByText('Create Group'));

    expect(screen.queryByText('Create Group')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter group name...')).toBeInTheDocument();
  });

  it('calls createGroup when Enter is pressed with a valid input', async () => {
    render(<GroupCreationForm />);

    // Afficher l'input
    fireEvent.click(screen.getByText('Create Group'));

    // Entrer un nom de groupe
    const input = screen.getByPlaceholderText('Enter group name...');
    fireEvent.change(input, { target: { value: 'New Test Group' } });

    // Appeler directement le gestionnaire Enter stocké
    global.mockKeyHandlers.Enter();

    // Vérifier que createGroup a été appelé avec les bons paramètres
    await waitFor(() => {
      expect(groupService.createGroup).toHaveBeenCalledWith({
        name: 'New Test Group',
        description: ''
      });
    });
  });

  it('cancels group creation when Escape is pressed', () => {
    render(<GroupCreationForm />);

    // Afficher l'input
    fireEvent.click(screen.getByText('Create Group'));

    // Entrer un nom de groupe
    const input = screen.getByPlaceholderText('Enter group name...');
    fireEvent.change(input, { target: { value: 'Canceled Group' } });

    // Appeler directement le gestionnaire Escape stocké
    global.mockKeyHandlers.Escape();

    // Vérifier que le bouton réapparaît
    expect(screen.getByText('Create Group')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter group name...')).not.toBeInTheDocument();

    // Vérifier que createGroup n'a pas été appelé
    expect(groupService.createGroup).not.toHaveBeenCalled();
  });

  it('uses provided callback after group creation', async () => {
    const onGroupCreated = jest.fn();
    render(<GroupCreationForm onGroupCreated={onGroupCreated} />);

    // Afficher l'input
    fireEvent.click(screen.getByText('Create Group'));

    // Entrer un nom de groupe
    const input = screen.getByPlaceholderText('Enter group name...');
    fireEvent.change(input, { target: { value: 'Callback Test Group' } });

    // Appeler directement le gestionnaire Enter stocké
    global.mockKeyHandlers.Enter();

    // Vérifier que createGroup a été appelé
    await waitFor(() => {
      expect(groupService.createGroup).toHaveBeenCalled();
      expect(onGroupCreated).toHaveBeenCalled();
    });
  });

  it('dispatches a custom event when no callback is provided but refetchOnCreate is true', async () => {
    render(<GroupCreationForm refetchOnCreate={true} />);

    // Afficher l'input
    fireEvent.click(screen.getByText('Create Group'));

    // Entrer un nom de groupe
    const input = screen.getByPlaceholderText('Enter group name...');
    fireEvent.change(input, { target: { value: 'Event Test Group' } });

    // Appeler directement le gestionnaire Enter stocké
    global.mockKeyHandlers.Enter();

    // Vérifier que l'événement a été dispatché
    await waitFor(() => {
      expect(mockDispatchEvent).toHaveBeenCalled();
      expect(mockDispatchEvent.mock.calls[0][0].type).toBe('groupCreated');
    });
  });

  it('does not dispatch event or reload when refetchOnCreate is false', async () => {
    render(<GroupCreationForm refetchOnCreate={false} />);

    // Afficher l'input
    fireEvent.click(screen.getByText('Create Group'));

    // Entrer un nom de groupe
    const input = screen.getByPlaceholderText('Enter group name...');
    fireEvent.change(input, { target: { value: 'No Reload Group' } });

    // Appeler directement le gestionnaire Enter stocké
    global.mockKeyHandlers.Enter();

    // Vérifier que le groupe a été créé
    await waitFor(() => {
      expect(groupService.createGroup).toHaveBeenCalled();
    });

    // Mais que l'événement n'a pas été dispatché
    expect(mockDispatchEvent).not.toHaveBeenCalled();
  });

  it('shows error message when group creation fails', async () => {
    // Mock d'une erreur lors de la création
    (groupService.createGroup as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<GroupCreationForm />);

    // Afficher l'input
    fireEvent.click(screen.getByText('Create Group'));

    // Entrer un nom de groupe
    const input = screen.getByPlaceholderText('Enter group name...');
    fireEvent.change(input, { target: { value: 'Error Test Group' } });

    // Appeler directement le gestionnaire Enter stocké
    global.mockKeyHandlers.Enter();

    // Vérifier que le message d'erreur s'affiche
    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });

  it('accepts custom button text', () => {
    render(<GroupCreationForm buttonText="Custom Button Text" />);

    expect(screen.getByText('Custom Button Text')).toBeInTheDocument();
  });

  it('displays only the input when inputOnly is true', () => {
    render(<GroupCreationForm inputOnly={true} />);

    // Le bouton ne doit pas être affiché
    expect(screen.queryByText('Create Group')).not.toBeInTheDocument();

    // L'input doit être affiché immédiatement
    expect(screen.getByPlaceholderText('Enter group name...')).toBeInTheDocument();
  });
});
