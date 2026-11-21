import { View, Text } from '@tarojs/components';
import './Divider.scss';

interface DividerProps {
  text?: string;
  spacing?: 'small' | 'medium' | 'large';
}

const Divider: React.FC<DividerProps> = ({
  text,
  spacing = 'medium',
}) => {
  if (text) {
    return (
      <View className={`divider divider--${spacing} divider--with-text`}>
        <View className="divider__line" />
        <Text className="divider__text">{text}</Text>
        <View className="divider__line" />
      </View>
    );
  }

  return (
    <View className={`divider divider--${spacing}`}>
      <View className="divider__line" />
    </View>
  );
};

export default Divider;
