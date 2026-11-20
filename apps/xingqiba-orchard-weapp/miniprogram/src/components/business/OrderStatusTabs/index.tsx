import { View, Text, ScrollView } from '@tarojs/components';
import { ORDER_STATUS_CONFIG } from '../../../constants';
import { OrderStatus } from '../../../types';
import './OrderStatusTabs.scss';

interface OrderStatusTabsProps {
  statuses?: typeof ORDER_STATUS_CONFIG;
  active: OrderStatus;
  onChange: (status: OrderStatus) => void;
  testidPrefix?: string;
  t?: (key: string) => string;
}

const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({
  statuses = ORDER_STATUS_CONFIG,
  active,
  onChange,
  testidPrefix = 'status-tab',
  t = (k) => k,
}) => {
  return (
    <ScrollView className="order-status-tabs" scrollX enableFlex>
      {statuses.map((item) => (
        <View
          key={item.value}
          className={`order-status-tabs__item ${active === item.value ? 'order-status-tabs__item--active' : ''}`}
          onClick={() => onChange(item.value)}
          data-testid={`${testidPrefix}-${item.value.toLowerCase()}`}
        >
          <Text className="order-status-tabs__label" style={{ color: active === item.value ? item.color : '#666666' }}>
            {t(item.labelKey)}
          </Text>
          {active === item.value && (
            <View className="order-status-tabs__underline" style={{ backgroundColor: item.color }} />
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default OrderStatusTabs;
