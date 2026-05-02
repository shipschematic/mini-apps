import { View, Text } from '@tarojs/components';
import { ORDER_TYPE_CONFIG } from '../../../constants';
import { OrderType } from '../../../types';
import './OrderTypeToggle.scss';

interface OrderTypeToggleProps {
  types?: typeof ORDER_TYPE_CONFIG;
  active: OrderType;
  onChange: (type: OrderType) => void;
  t?: (key: string) => string;
}

const OrderTypeToggle: React.FC<OrderTypeToggleProps> = ({
  types = ORDER_TYPE_CONFIG,
  active,
  onChange,
  t = (k) => k,
}) => {
  return (
    <View className="order-type-toggle">
      {types.map((item) => (
        <View
          key={item.value}
          className={`order-type-toggle__item ${active === item.value ? 'order-type-toggle__item--active' : ''}`}
          onClick={() => onChange(item.value)}
        >
          <Text className="order-type-toggle__label">{t(item.labelKey)}</Text>
        </View>
      ))}
    </View>
  );
};

export default OrderTypeToggle;
