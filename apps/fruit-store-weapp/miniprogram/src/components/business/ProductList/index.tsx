import { View } from '@tarojs/components';
import { Product } from '../../../types';
import ProductCard from '../ProductCard';
import EmptyState from '../../common/EmptyState';
import LoadingSpinner from '../../common/LoadingSpinner';
import './ProductList.scss';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  onBuy: (product: Product) => void;
  layout?: 'horizontal' | 'vertical';
  testidPrefix?: string;
  t?: (key: string) => string;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading = false,
  onBuy,
  layout = 'horizontal',
  testidPrefix,
  t = (k) => k,
}) => {
  if (loading) {
    return (
      <View className="product-list__loading">
        <LoadingSpinner />
      </View>
    );
  }

  if (products.length === 0) {
    return <EmptyState title={t('noOrders')} description={t('noOrdersDesc')} />;
  }

  return (
    <View className="product-list">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          onBuy={onBuy}
          layout={layout}
          testid={testidPrefix ? `${testidPrefix}-${index}` : undefined}
          t={t}
        />
      ))}
    </View>
  );
};

export default ProductList;
