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
  book:       { symbol: 'F',   bg: '#E8F4FD' },
  checkin:    { symbol: '◎',  bg: '#FFF7E6' },
  review:     { symbol: '★',  bg: '#FDF8F3' },
  comment:    { symbol: '♦',  bg: '#EDF7EF' },
  'order-review': { symbol: '✎', bg: '#F5F0FF' },
  product:    { symbol: '⬡',  bg: '#FFEDE8' },
  note:       { symbol: '☰',  bg: '#F0F8FF' },
  like:       { symbol: '♥',  bg: '#FFE8EE' },
  appointment:{ symbol: '◷',  bg: '#F0FFF0' },
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
        const icon = iconMap[item.icon] || { symbol: '◆', bg: '#f0f0f0' };
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
              <Text className="service-grid__icon-text" style={{ color: icon.bg === '#FDF8F3' ? '#C8A882' : '#555' }}>
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
