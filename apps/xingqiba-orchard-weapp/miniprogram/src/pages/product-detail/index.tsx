import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { useStore } from '../../store';
import { Tag, PriceTag, LoadingSpinner } from '../../components/common';
import { BottomActionBar } from '../../components/business';
import { useAuth } from '../../hooks';
import { useI18n } from '../../hooks/useI18n';
import { productApi, orderApi } from '../../api';
import { paymentService } from '../../services';
import { Product } from '../../types';
import { wxService } from '../../services';
import { formatSoldCount } from '../../utils/format';
import { ROUTES } from '../../constants';
import './index.scss';

function ProductDetailPage() {
  const { isLoggedIn, login } = useAuth();
  const products = useStore((state) => state.product.list);
  const currentStore = useStore((state) => state.store.currentStore);
  const createOrder = useStore((state) => state.setOrder);
  const { t } = useI18n();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      const pages = Taro.getCurrentPages?.() || [];
      const currentPage = pages[pages.length - 1];
      const productId = (currentPage as any).productId || (currentPage as any).options?.productId;

      if (productId) {
        const productData = products.find((p) => p.id === productId) || await productApi.getProductDetail(productId);
        setProduct(productData);
      } else {
        const productData = products[0] || null;
        setProduct(productData);
      }
      setLoading(false);
    };

    loadProduct();
  }, []);

  const handleHomeClick = () => {
    wxService.switchTab(ROUTES.HOME);
  };

  const handleShare = () => {
    wxService.shareAppMessage({
      title: product?.title || t('storeName'),
      path: `${ROUTES.PRODUCT_DETAIL}?productId=${product?.id}`,
    });
  };

  const handleBuy = async () => {
    if (!isLoggedIn) {
      login();
      return;
    }

    if (!product) return;

    wxService.showLoading({ title: t('creating') });

    try {
      const order = await orderApi.createOrder({
        type: 'direct',
        productId: product.id,
        productSnapshot: {
          productId: product.id,
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          originalPrice: product.originalPrice,
        },
        quantity: 1,
        totalPrice: product.price,
        storeId: currentStore?.id || product.storeId,
      });

      if (order) {
        const existingOrders = useStore.getState().order.directOrders;
        createOrder({
          directOrders: [...existingOrders, order],
        });

        await paymentService.requestPayment(order.id);
      }
    } catch (error) {
      wxService.showToast({ title: t('fail'), type: 'error' });
    }
  };

  if (loading) {
    return (
      <View className="product-detail__loading">
        <LoadingSpinner fullscreen />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="product-detail__error">
        <Text>{t('noOrders')}</Text>
      </View>
    );
  }

  return (
    <View className="product-detail">
      <ScrollView className="product-detail__content" scrollY>
        <Image
          className="product-detail__image"
          src={product.imageUrl}
          mode="aspectFill"
          lazyLoad
        />

        <View className="product-detail__info">
          <View className="product-detail__title-row">
            <PriceTag price={product.price} originalPrice={product.originalPrice} size="medium" />
            <Text className="product-detail__sold">{t('selfPickup')}{formatSoldCount(product.soldCount)}</Text>
          </View>
          <Text className="product-detail__title">{product.title}</Text>

          <View className="product-detail__tags">
          {(product.tags || []).map((tag) => (
            <Tag key={tag} text={tag} type="primary" />
          ))}
        </View>
        </View>

        <View className="product-detail__section">
          <Text className="product-detail__section-title">{t('availableStores')}</Text>
          <View className="product-detail__store">
            <Text className="product-detail__store-name">{currentStore?.name || t('storeName')}</Text>
            <Text className="product-detail__store-addr">{currentStore?.address || ''}</Text>
          </View>
        </View>

        <View className="product-detail__section">
          <Text className="product-detail__section-title">{t('packageContent')}</Text>
          {(product.content || []).map((item, index) => (
            <View key={index} className="product-detail__content-item">
              <Text className="product-detail__content-name">{item.name}</Text>
              <Text className="product-detail__content-count">{item.count}</Text>
            </View>
          ))}
        </View>

        <View className="product-detail__section">
          <Text className="product-detail__section-title">{t('purchaseNotes')}</Text>
          {(product.rules || []).map((rule, index) => (
            <View key={index} className="product-detail__rule">
              <Text className="product-detail__rule-label">{rule.label}</Text>
              <Text className="product-detail__rule-value">{rule.value}</Text>
            </View>
          ))}
        </View>

        <View className="product-detail__section product-detail__desc">
          <Text className="product-detail__section-title">{t('details')}</Text>
          <Text className="product-detail__desc-text">{product.description}</Text>
        </View>
      </ScrollView>

      <BottomActionBar
        leftActions={[
          { icon: 'H', text: t('home'), onClick: handleHomeClick, testid: 'home-button' },
          { icon: 'S', text: t('share'), onClick: handleShare, testid: 'share-button' },
        ]}
        primaryAction={{
          text: `${t('rushBuy')} ¥${product.price}`,
          onClick: handleBuy,
          testid: 'rush-buy-button',
        }}
      />
    </View>
  );
}

export default ProductDetailPage;
