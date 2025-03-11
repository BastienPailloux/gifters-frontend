import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Checkbox from '../Checkbox';

describe('Checkbox Component', () => {
  test('renders checkbox with default props', () => {
    render(<Checkbox name="test" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  test('renders checkbox with label', () => {
    render(<Checkbox name="test" label="Test Label" />);

    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();

    // Clicking the label should toggle the checkbox
    fireEvent.click(label);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('renders checked checkbox', () => {
    render(<Checkbox name="test" checked onChange={() => {}} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });


  test('renders checkbox with error message', () => {
    render(<Checkbox name="test" error="Error message" />);

    const errorMessage = screen.getByText('Error message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  test('renders checkbox with helper text', () => {
    render(<Checkbox name="test" helperText="Helper text" />);

    const helperText = screen.getByText('Helper text');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  test('calls onChange handler when toggled', () => {
    const handleChange = jest.fn();
    render(<Checkbox name="test" onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders disabled checkbox', () => {
    render(<Checkbox name="test" disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  test('applies additional className to checkbox input', () => {
    render(<Checkbox name="test" checkboxClassName="test-checkbox-class" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('test-checkbox-class');
  });

  test('applies additional className to label', () => {
    render(<Checkbox name="test" label="Test" labelClassName="test-label-class" />);

    const label = screen.getByText('Test');
    expect(label).toHaveClass('test-label-class');
  });

  test('applies additional className to container', () => {
    render(<Checkbox name="test" containerClassName="test-container-class" />);

    // Since there's no direct way to get the container, check if it's a parent of the checkbox
    const checkbox = screen.getByRole('checkbox');
    const container = checkbox.closest('.test-container-class');

    expect(container).toBeInTheDocument();
  });

  test('supports ReactNode as label', () => {
    render(
      <Checkbox
        name="test"
        label={<span data-testid="custom-label">Custom Label</span>}
      />
    );

    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });
});
