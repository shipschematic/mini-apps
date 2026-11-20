import { View, Text, Image, Button, Input } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { AppShell } from '../../../core/AppShell';
import './index.scss';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const checkAuth = () => {
    const isAdmin = Taro.getStorageSync('admin_verified');
    if (!isAdmin) {
      Taro.redirectTo({ url: '/pages/admin/login/index' });
      return false;
    }
    return true;
  };

  const loadProducts = () => {
    if (!checkAuth()) return;

    setLoading(true);
    try {
      const configProducts = AppShell.getProducts();
      setProducts(configProducts || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      Taro.showToast({ title: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    Taro.navigateTo({ url: '/pages/admin/products/edit/index' });
  };

  const handleEdit = (product: any) => {
    Taro.navigateTo({
      url: `/pages/admin/products/edit/index?product=${encodeURIComponent(JSON.stringify(product))}`,
    });
  };

  const handleDelete = (product: any) => {
    Taro.showModal({
      title: 'Notice',
      content: `To delete "${product.title}", edit the config file:\npublic/config/app.json`,
      confirmText: 'OK',
      showCancel: false,
    });
  };

  const handleLogout = () => {
    Taro.removeStorageSync('admin_verified');
    Taro.redirectTo({ url: '/pages/admin/login/index' });
  };

  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="admin-products">
      <View className="admin-products__header">
        <Text className="admin-products__title">Product Management (Config)</Text>
        <Button className="admin-products__logout-btn" onClick={handleLogout}>
          Logout
        </Button>
      </View>

      <View className="admin-products__info">
        <Text className="admin-products__info-text">
          Products are loaded from public/config/app.json (AppShell). Edit the JSON file to add/modify products.
        </Text>
      </View>

      <View className="admin-products__toolbar">
        <Input
          className="admin-products__search"
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onInput={(e) => setSearchQuery(e.detail.value)}
        />
        <Button className="admin-products__add-btn" type="primary" onClick={handleAdd}>
          + Add Product
        </Button>
      </View>

      {loading ? (
        <View className="admin-products__loading">
          <Text>Loading...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View className="admin-products__empty">
          <Text>No products found in config</Text>
          <Button onClick={handleAdd}>Add your first product</Button>
        </View>
      ) : (
        <View className="admin-products__list">
          {filteredProducts.map((product) => (
            <View key={product.id} className="admin-product-card">
              <Image
                className="admin-product-card__image"
                src={product.imageUrl || '/assets/images/logo.png'}
                mode="aspectFill"
              />
              <View className="admin-product-card__info">
                <Text className="admin-product-card__title" numberOfLines={2}>
                  {product.title}
                </Text>
                <View className="admin-product-card__price-row">
                  <Text className="admin-product-card__price">¥{product.price}</Text>
                  <Text className="admin-product-card__original-price">¥{product.originalPrice}</Text>
                </View>
                <View className="admin-product-card__tags">
                  {(product.tags || []).slice(0, 2).map((tag: string) => (
                    <Text key={tag} className="admin-product-card__tag">
                      {tag}
                    </Text>
                  ))}
                </View>
              </View>
              <View className="admin-product-card__actions">
                <Button className="admin-product-card__edit-btn" size="mini" onClick={() => handleEdit(product)}>
                  Edit
                </Button>
                <Button className="admin-product-card__delete-btn" size="mini" onClick={() => handleDelete(product)}>
                  Info
                </Button>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
