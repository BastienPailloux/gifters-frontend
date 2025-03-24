import Card from '../common/display/Card';
import Button from '../common/forms/Button';
import { GroupItemsListProps } from '../../types/groups';

// Composant générique pour afficher une liste d'éléments avec un titre et une action
// Ce composant utilise les types centralisés pour une meilleure maintenabilité
function GroupItemsList<T>({
  title,
  items,
  emptyMessage,
  actionLabel,
  onAction,
  renderItem,
  className
}: GroupItemsListProps<T>) {
  return (
    <Card
      title={title}
      className={`h-full ${className || ''}`}
    >
      {items && items.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {items.map((item, index) => (
            <li key={index} className="py-3">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-4">{emptyMessage}</p>
      )}

      <div className="mt-4">
        <Button
          variant="outline"
          fullWidth
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}

export default GroupItemsList;
