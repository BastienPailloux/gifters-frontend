import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageSwitcher from '../LanguageSwitcher';

// Mock du module useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
    t: (key: string) => key,
  }),
}));

describe('LanguageSwitcher Component', () => {
  test('renders dropdown variant by default', () => {
    const { container } = render(<LanguageSwitcher />);

    // Vérifier qu'il y a un bouton avec le texte "English"
    const button = screen.getByRole('button', { name: /English/i });
    expect(button).toBeInTheDocument();

    // Vérifier qu'il y a une icône de flèche vers le bas
    const arrow = container.querySelector('svg');
    expect(arrow).toBeInTheDocument();

    // Vérifier que le dropdown est fermé initialement
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('opens dropdown when clicked', () => {
    render(<LanguageSwitcher />);

    // Cliquer sur le bouton pour ouvrir le dropdown
    const button = screen.getByRole('button', { name: /English/i });
    fireEvent.click(button);

    // Vérifier que le dropdown est ouvert
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    // Vérifier que les options de langue sont affichées dans le menu
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBe(2);
    expect(menuItems[0].textContent).toContain('English');
    expect(menuItems[1].textContent).toContain('Français');
  });

  test('closes dropdown when clicking outside', () => {
    render(<LanguageSwitcher />);

    // Ouvrir le dropdown
    const button = screen.getByRole('button', { name: /English/i });
    fireEvent.click(button);

    // Vérifier que le dropdown est ouvert
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Cliquer en dehors du dropdown
    const overlay = document.querySelector('.fixed.inset-0');
    fireEvent.click(overlay!);

    // Vérifier que le dropdown est fermé
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('renders buttons variant correctly', () => {
    // Forcer la langue active à 'en' pour ce test
    render(<LanguageSwitcher variant="buttons" />);

    // Vérifier que les deux boutons sont rendus
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    // Vérifier le contenu des boutons
    expect(buttons[0].textContent).toContain('English');
    expect(buttons[1].textContent).toContain('Français');

    // Note: Nous ne pouvons pas tester les classes CSS dynamiques basées sur i18n.language
    // car notre mock est statique. Vérifions simplement que les boutons existent.
  });

  test('renders minimal variant correctly', () => {
    render(<LanguageSwitcher variant="minimal" />);

    // Vérifier que les deux boutons sont rendus
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    // Vérifier le contenu des boutons
    expect(buttons[0].textContent).toBe('en');
    expect(buttons[1].textContent).toBe('fr');

    // Note: Comme pour le test précédent, nous ne testons pas les classes CSS dynamiques
  });

  test('accepts custom languages prop', () => {
    const customLanguages = [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    ];

    render(<LanguageSwitcher languages={customLanguages} />);

    // Ouvrir le dropdown
    const button = screen.getByRole('button', { name: /English/i });
    fireEvent.click(button);

    // Vérifier que toutes les langues personnalisées sont affichées
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBe(3);
    expect(menuItems[0].textContent).toContain('English');
    expect(menuItems[1].textContent).toContain('Español');
    expect(menuItems[2].textContent).toContain('Deutsch');
  });

  test('applies custom className', () => {
    const { container } = render(<LanguageSwitcher className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('applies custom buttonClassName', () => {
    render(<LanguageSwitcher buttonClassName="custom-button-class" />);
    const button = screen.getByRole('button', { name: /English/i });
    expect(button).toHaveClass('custom-button-class');
  });

  test('applies custom dropdownClassName', () => {
    render(<LanguageSwitcher dropdownClassName="custom-dropdown-class" />);

    // Ouvrir le dropdown
    const button = screen.getByRole('button', { name: /English/i });
    fireEvent.click(button);

    // Vérifier la classe du dropdown
    const dropdown = screen.getByRole('menu').parentElement;
    expect(dropdown).toHaveClass('custom-dropdown-class');
  });
});
