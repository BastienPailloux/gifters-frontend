import { render, screen } from '@testing-library/react';
import LabelValue from '../LabelValue';

describe('LabelValue Component', () => {
  test('renders with simple text value', () => {
    render(<LabelValue label="Test Label" value="Test Value" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('text-sm');
    expect(label).toHaveClass('text-gray-500');
  });

  test('renders with React node as value', () => {
    render(
      <LabelValue
        label="Complex Value"
        value={<span data-testid="complex-value">Complex <strong>HTML</strong> Value</span>}
      />
    );

    expect(screen.getByText('Complex Value')).toBeInTheDocument();
    expect(screen.getByTestId('complex-value')).toBeInTheDocument();
    expect(screen.getByText('HTML')).toBeInTheDocument();
  });

  test('applies additional classes correctly', () => {
    render(
      <LabelValue
        label="Custom Classes"
        value="Value with custom classes"
        className="test-container-class"
        labelClassName="test-label-class"
        valueClassName="test-value-class"
      />
    );

    const container = screen.getByText('Custom Classes').parentElement;
    expect(container).not.toBeNull();
    if (container) {
      expect(container).toHaveClass('test-container-class');
    }

    expect(screen.getByText('Custom Classes')).toHaveClass('test-label-class');
    expect(screen.getByText('Value with custom classes')).toHaveClass('test-value-class');
  });

  test('renders in horizontal orientation', () => {
    render(
      <LabelValue
        label="Horizontal Label"
        value="Horizontal Value"
        orientation="horizontal"
      />
    );

    const container = screen.getByText('Horizontal Label').parentElement;
    expect(container).not.toBeNull();
    if (container) {
      expect(container).toHaveClass('flex');
      expect(container).toHaveClass('flex-row');
    }

    expect(screen.getByText('Horizontal Label')).toHaveClass('mb-0');
  });

  test('applies important styling to value', () => {
    render(
      <LabelValue
        label="Important Label"
        value="Important Value"
        isImportant
      />
    );

    expect(screen.getByText('Important Value')).toHaveClass('font-medium');
  });
});
