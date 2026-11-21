import { View, Text } from '@tarojs/components';
import { useCallback } from 'react';
import { SERVICE_GRID_CONFIG } from '../../../constants';
import { ServiceItem } from '../../../types';
import './ServiceGrid.scss';

interface ServiceGridProps {
  services?: ServiceItem[];
  columns?: number;
  onItemClick: (item: ServiceItem) => void;
  t?: (key: string) => string;
}

const iconMap: Record<string, { symbol: string; bg: string }> = {
  book:       { symbol: 'F',   bg: 'var(--color-service-blue-soft)' },
  checkin:    { symbol: '◎',  bg: 'var(--color-warning-soft)' },
  review:     { symbol: '★',  bg: 'var(--color-background)' },
  comment:    { symbol: '♦',  bg: 'var(--color-success-soft)' },
  'order-review': { symbol: '✎', bg: 'var(--color-service-purple-soft)' },
  product:    { symbol: '⬡',  bg: 'var(--color-service-peach-soft)' },
  note:       { symbol: '☰',  bg: 'var(--color-service-blue-soft)' },
  like:       { symbol: '♥',  bg: 'var(--color-service-pink-soft)' },
  appointment:{ symbol: '◷',  bg: 'var(--color-service-green-soft)' },
};

const ServiceGrid: React.FC<ServiceGridProps> = ({
  services = SERVICE_GRID_CONFIG,
  onItemClick,
  t = (k) => k,
}) => {
  const handleItemClick = useCallback((labelKey: string) => {
    const item = services.find(s => s.labelKey === labelKey);
    if (item) {
      onItemClick(item);
    }
  }, [services, onItemClick]);

  return (
    <View className="service-grid">
      {services.map((item) => {
        const icon = iconMap[item.icon] || { symbol: '◆', bg: 'var(--color-surface-muted)' };
        return (
          <View
            key={item.labelKey}
            className="service-grid__item"
            onClick={() => handleItemClick(item.labelKey)}
            data-label-key={item.labelKey}
          >
            <View
              className="service-grid__icon-box"
              style={{ background: icon.bg }}
            >
              <Text className="service-grid__icon-text" style={{ color: icon.bg === 'var(--color-background)' ? 'var(--color-primary)' : 'var(--color-muted)' }}>
                {icon.symbol}
              </Text>
            </View>
            <Text className="service-grid__label">{t(item.labelKey)}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default ServiceGrid;
