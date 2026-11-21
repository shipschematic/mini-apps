import { View, Text, Button } from '@tarojs/components';
import './EmptyState.scss';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  testid?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  testid,
}) => {
  return (
    <View className="empty-state" data-testid={testid}>
      <View className="empty-state__icon">📦</View>
      <Text className="empty-state__title">{title}</Text>
      {description && <Text className="empty-state__description">{description}</Text>}
      {actionText && onAction && (
        <Button className="empty-state__action" onClick={onAction} data-testid={testid ? `${testid}-action` : undefined}>
          {actionText}
        </Button>
      )}
    </View>
  );
};

export default EmptyState;
