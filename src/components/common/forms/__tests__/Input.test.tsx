import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../Input';

describe('Input Component', () => {
  test('renders input with default props', () => {
    render(<Input name="test" />);
    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('w-full');
  });

  test('renders input with label', () => {
    render(<Input name="test" label="Test Label" />);

    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  test('renders input with error message', () => {
    render(<Input name="test" error="Error message" />);

    const errorMessage = screen.getByText('Error message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  test('renders input with helper text', () => {
    render(<Input name="test" helperText="Helper text" />);

    const helperText = screen.getByText('Helper text');
    expect(helperText).toBeInTheDocument();
  });

  test('renders input with start icon', () => {
    render(
      <Input
        name="test"
        startIcon={<span data-testid="start-icon">🔍</span>}
      />
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  test('renders input with end icon', () => {
    render(
      <Input
        name="test"
        endIcon={<span data-testid="end-icon">❌</span>}
      />
    );

    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  test('calls onChange handler when value changes', () => {
    const handleChange = jest.fn();
    render(<Input name="test" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders disabled input', () => {
    render(<Input name="test" disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  test('applies additional className to input container', () => {
    render(<Input name="test" containerClassName="test-container-class" />);

    // Rechercher le div parent avec la classe test-container-class
    const container = screen.getByTestId('input-container');
    expect(container).toHaveClass('test-container-class');
  });

  test('forwards additional props to input element', () => {
    render(<Input name="test" data-testid="test-input" placeholder="Test placeholder" />);

    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('placeholder', 'Test placeholder');
  });
});
