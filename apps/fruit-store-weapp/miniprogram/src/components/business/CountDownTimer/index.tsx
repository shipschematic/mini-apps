import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import './CountDownTimer.scss';

interface CountDownTimerProps {
  endTime: string | number;
  onEnd?: () => void;
  format?: (seconds: number) => string;
}

const CountDownTimer: React.FC<CountDownTimerProps> = ({
  endTime,
  onEnd,
  format,
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    const end = typeof endTime === 'string' ? new Date(endTime).getTime() : endTime;
    const now = Date.now();
    const diff = Math.max(0, Math.floor((end - now) / 1000));
    setRemainingSeconds(diff);

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onEnd]);

  const formatTime = (seconds: number): string => {
    if (format) return format(seconds);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View className="count-down-timer">
      <Text className="count-down-timer__text">{formatTime(remainingSeconds)}</Text>
    </View>
  );
};

export default CountDownTimer;
