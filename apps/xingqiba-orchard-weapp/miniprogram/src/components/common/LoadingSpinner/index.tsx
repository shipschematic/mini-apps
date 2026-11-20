import { View } from '@tarojs/components';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullscreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#C8A882',
  fullscreen = false,
}) => {
  return (
    <View className={`loading-spinner ${fullscreen ? 'loading-spinner--fullscreen' : ''}`}>
      <View
        className={`loading-spinner__item loading-spinner__item--${size}`}
        style={{ borderColor: `${color}20`, borderTopColor: color }}
      />
    </View>
  );
};

export default LoadingSpinner;
