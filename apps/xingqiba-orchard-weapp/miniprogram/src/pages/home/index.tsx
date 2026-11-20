import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState, useCallback, useEffect } from 'react';
import { useStore } from '../../store';
import { ProductList, StoreSelector } from '../../components/business';
import { useAuth } from '../../hooks';
import { useI18n } from '../../hooks/useI18n';
import { locationService, wxService } from '../../services';
import { ROUTES } from '../../constants';
import { AppShell } from '../../core/AppShell';
import './index.scss';

function HomePage() {
  const { isLoggedIn, login } = useAuth();
  const currentStore = useStore((state) => state.store.currentStore);
  const storeList = useStore((state) => state.store.storeList);
  const [products, setProducts] = useState<any[]>([]);
  const setStoreAction = useStore((state) => state.setStore);
  const { t } = useI18n();

  const [storeSelectorVisible, setStoreSelectorVisible] = useState(false);

  useEffect(() => {
    const loadProducts = () => {
      try {
        const configProducts = AppShell.getProducts();
        if (configProducts && configProducts.length > 0) {
          setProducts(configProducts);
          useStore.getState().setProduct({ list: configProducts });
        }
      } catch (e) {
        console.error('[HomePage] Failed to load products:', e);
      }
    };

    if (AppShell.isInitialized()) {
      loadProducts();
    } else {
      AppShell.loadConfig().then(() => loadProducts()).catch(() => {});
    }
  }, []);

  const handlePullDownRefresh = useCallback(async () => {
    wxService.showLoading();
    setTimeout(() => {
      wxService.hideLoading();
    }, 1000);
  }, []);

  const handleStoreSelect = (store: any) => {
    setStoreAction({ currentStore: store });
    setStoreSelectorVisible(false);
  };

  const handleStoreNavigate = () => {
    if (currentStore) {
      locationService.openLocation(currentStore);
    }
  };

  const handleProductBuy = (product: any) => {
    if (!isLoggedIn) {
      login();
      return;
    }
    wxService.navigateTo(`${ROUTES.PRODUCT_DETAIL}?productId=${product.id}`);
  };

  return (
    <ScrollView className="home-page" scrollY onPullDownRefresh={handlePullDownRefresh}>
      <View className="home-page__inner">
        <View className="home-page__banner">
          <Image className="home-page__logo" src="/assets/images/logo.png" mode="aspectFit" />
          <Text className="home-page__title">{t('storeName')}</Text>
        </View>

        <View className="home-page__store-card">
          <View className="home-page__store-info">
            <View className="home-page__store-header">
              <Text className="home-page__store-name">{currentStore?.name || t('storeName')}</Text>
              <Text
                className="home-page__store-switch"
                onClick={() => setStoreSelectorVisible(true)}
                data-testid="switch-store-button"
              >
                {t('switchStore')}({storeList.length}) &gt;
              </Text>
            </View>
            <View className="home-page__store-address" onClick={handleStoreNavigate}>
              <Text className="home-page__address-text">{currentStore?.address || ''}</Text>
              <Text className="home-page__nav-btn">{t('navigation')}</Text>
            </View>
          </View>
        </View>

        <View className="home-page__section">
          <View className="home-page__section-header">
            <Text className="home-page__section-title">{t('groupBuy')}({products.length})</Text>
            <Text
              className="home-page__section-more"
              onClick={() => wxService.navigateTo(ROUTES.ORDERS)}
              data-testid="view-all-orders"
            >
              {t('viewAll')} &gt;
            </Text>
          </View>
          <ProductList products={products} onBuy={handleProductBuy} layout="horizontal" testidPrefix="product-card" t={t} />
        </View>

        <StoreSelector
          stores={storeList}
          selectedId={currentStore?.id || null}
          visible={storeSelectorVisible}
          onSelect={handleStoreSelect}
          onClose={() => setStoreSelectorVisible(false)}
          t={t}
        />
      </View>
    </ScrollView>
  );
}

export default HomePage;
