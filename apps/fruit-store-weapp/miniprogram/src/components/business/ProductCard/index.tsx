import { View, Text, Image } from '@tarojs/components';
import { Product } from '../../../types';
import PriceTag from '../../common/PriceTag';
import Tag from '../../common/Tag';
import { formatSoldCount } from '../../../utils/format';
import './ProductCard.scss';

interface ProductCardProps {
  product: Product;
  onBuy?: (product: Product) => void;
  layout?: 'horizontal' | 'vertical';
  testid?: string;
  t?: (key: string) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuy,
  layout = 'horizontal',
  testid,
  t = (k) => k,
}) => {
  const handleBuy = () => {
    onBuy?.(product);
  };

  if (layout === 'vertical') {
    return (
      <View className="product-card product-card--vertical" data-product-id={product.id}>
        <Image
          className="product-card__image"
          src={product.imageUrl}
          mode="aspectFill"
          lazyLoad
        />
        <View className="product-card__content">
          <Text className="product-card__title" numberOfLines={2}>{product.title}</Text>
          <View className="product-card__tags">
            {product.tags.slice(0, 2).map((tag) => (
              <Tag key={tag} text={tag} size="small" />
            ))}
          </View>
          <View className="product-card__price-row">
            <PriceTag price={product.price} originalPrice={product.originalPrice} size="small" />
            <Text className="product-card__sold">{t('sold')}{formatSoldCount(product.soldCount)}</Text>
          </View>
          <View className="product-card__action" onClick={handleBuy} data-testid={testid ? `${testid}-buy` : undefined}>
            <Text className="product-card__buy-btn">{t('rushBuy')}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="product-card product-card--horizontal" data-product-id={product.id}>
      <Image
        className="product-card__image"
        src={product.imageUrl}
        mode="aspectFill"
        lazyLoad
      />
      <View className="product-card__content">
        <Text className="product-card__title" numberOfLines={2}>{product.title}</Text>
        <View className="product-card__tags">
          {product.tags.slice(0, 2).map((tag) => (
            <Tag key={tag} text={tag} size="small" />
          ))}
        </View>
        <View className="product-card__bottom">
          <PriceTag price={product.price} originalPrice={product.originalPrice} size="small" />
          <View className="product-card__right">
            <Text className="product-card__sold">{t('sold')}{formatSoldCount(product.soldCount)}</Text>
            <View className="product-card__action" onClick={handleBuy} data-testid={testid ? `${testid}-buy` : undefined}>
              <Text className="product-card__buy-btn">{t('rushBuy')}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
