import { View, Text } from '@tarojs/components';
import { formatPrice } from '../../../utils/format';
import './PriceTag.scss';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: 'small' | 'medium' | 'large';
  showDecimal?: boolean;
}

const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  size = 'medium',
  showDecimal = true,
}) => {
  return (
    <View className={`price-tag price-tag--${size}`}>
      <Text className="price-tag__current">{formatPrice(price, showDecimal)}</Text>
      {originalPrice && originalPrice > price && (
        <Text className="price-tag__original">{formatPrice(originalPrice, showDecimal)}</Text>
      )}
    </View>
  );
};

export default PriceTag;
