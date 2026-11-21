import { View, Text } from '@tarojs/components';
import './Tag.scss';

interface TagProps {
  text: string;
  type?: 'primary' | 'warning' | 'success' | 'info';
  size?: 'small' | 'medium';
}

const Tag: React.FC<TagProps> = ({
  text,
  type = 'primary',
  size = 'small',
}) => {
  return (
    <View className={`tag tag--${type} tag--${size}`}>
      <Text className="tag__text">{text}</Text>
    </View>
  );
};

export default Tag;
