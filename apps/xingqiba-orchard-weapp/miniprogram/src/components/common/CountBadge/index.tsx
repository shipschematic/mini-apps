import { View, Text } from '@tarojs/components';
import './CountBadge.scss';

interface CountBadgeProps {
  count: number;
  max?: number;
}

const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
}) => {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <View className="count-badge">
      <Text className="count-badge__text">{displayCount}</Text>
    </View>
  );
};

export default CountBadge;
