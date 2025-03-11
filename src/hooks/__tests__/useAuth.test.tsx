import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import useAuth from '../useAuth';
import { authService } from '../../services/api';
import axios from 'axios';

// Mock des modules
vi.mock('../../services/api', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    isAuthenticated: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize with loading state', () => {
    // Mock des fonctions
    vi.mocked(authService.getCurrentUser).mockReturnValue(null);
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should load user if authenticated', () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };

    // Mock des fonctions
    vi.mocked(authService.getCurrentUser).mockReturnValue(mockUser);
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('should login successfully', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    const credentials = { email: 'test@example.com', password: 'password' };

    // Mock de la fonction login
    vi.mocked(authService.login).mockResolvedValue({
      user: mockUser,
      token: 'fake-token',
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const loginResult = await result.current.login(credentials);
      expect(loginResult).toEqual({ success: true });
    });

    expect(authService.login).toHaveBeenCalledWith(credentials);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('should handle login error', async () => {
    const credentials = { email: 'test@example.com', password: 'wrong-password' };
    const errorMessage = 'Invalid credentials';

    // Mock de la fonction login pour simuler une erreur
    vi.mocked(authService.login).mockRejectedValue({
      isAxiosError: true,
      response: {
        data: { message: errorMessage },
      },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const loginResult = await result.current.login(credentials);
      expect(loginResult).toEqual({ success: false, error: errorMessage });
    });

    expect(authService.login).toHaveBeenCalledWith(credentials);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });

  it('should register and login successfully', async () => {
    const mockUser = { id: '1', name: 'New User', email: 'new@example.com' };
    const registerData = { name: 'New User', email: 'new@example.com', password: 'password' };

    // Mock des fonctions
    vi.mocked(authService.register).mockResolvedValue({ success: true });
    vi.mocked(authService.login).mockResolvedValue({
      user: mockUser,
      token: 'fake-token',
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const registerResult = await result.current.register(registerData);
      expect(registerResult).toEqual({ success: true });
    });

    expect(authService.register).toHaveBeenCalledWith(registerData);
    expect(authService.login).toHaveBeenCalledWith({
      email: registerData.email,
      password: registerData.password,
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('should logout successfully', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };

    // Simuler un utilisateur connecté
    vi.mocked(authService.getCurrentUser).mockReturnValue(mockUser);
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);

    const { result } = renderHook(() => useAuth());

    // Vérifier que l'utilisateur est connecté
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);

    // Déconnecter l'utilisateur
    act(() => {
      result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should clear error', async () => {
    const credentials = { email: 'test@example.com', password: 'wrong-password' };
    const errorMessage = 'Invalid credentials';

    // Mock de la fonction login pour simuler une erreur
    vi.mocked(authService.login).mockRejectedValue({
      isAxiosError: true,
      response: {
        data: { message: errorMessage },
      },
    });

    const { result } = renderHook(() => useAuth());

    // Simuler une erreur de connexion
    await act(async () => {
      await result.current.login(credentials);
    });

    expect(result.current.error).toBe(errorMessage);

    // Effacer l'erreur
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
