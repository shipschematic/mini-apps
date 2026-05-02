import { View, Text } from '@tarojs/components';
import './ErrorRetry.scss';

interface ErrorRetryProps {
  message?: string;
  onRetry: () => void;
  t?: (key: string) => string;
}

const ErrorRetry: React.FC<ErrorRetryProps> = ({
  message,
  onRetry,
  t = (k) => k,
}) => {
  return (
    <View className="error-retry">
      <Text className="error-retry__message">{message || t('fail')}</Text>
      <View className="error-retry__btn" onClick={onRetry}>
        <Text>{t('confirm')}</Text>
      </View>
    </View>
  );
};

export default ErrorRetry;
