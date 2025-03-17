import { twMerge } from 'tailwind-merge';
import { ToggleSelectProps } from '../../../types';

/**
 * Composant générique permettant de basculer entre plusieurs options
 * dans un style d'onglets simples.
 */
function ToggleSelect<T extends string | number>({
  options,
  value,
  onChange,
  className,
  optionClassName,
  selectedClassName,
  unselectedClassName
}: ToggleSelectProps<T>) {
  // Classes par défaut
  const defaultContainerClass = "flex space-x-4 border-b pb-4";
  const defaultOptionClass = "py-2 px-4 rounded-t-lg transition-colors cursor-pointer";
  const defaultSelectedClass = "bg-primary-100 text-primary-700 font-medium hover:bg-primary-200";
  const defaultUnselectedClass = "text-gray-500 hover:text-gray-800 hover:bg-gray-100";

  return (
    <div className={twMerge(defaultContainerClass, className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={twMerge(
            defaultOptionClass,
            optionClassName,
            value === option.value
              ? twMerge(defaultSelectedClass, selectedClassName)
              : twMerge(defaultUnselectedClass, unselectedClassName)
          )}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ToggleSelect;
