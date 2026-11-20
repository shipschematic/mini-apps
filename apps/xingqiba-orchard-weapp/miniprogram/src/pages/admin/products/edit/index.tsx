import { View, Text, Input, Button } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Product } from '../../../../types';

const DEFAULT_PRODUCT: Omit<Product, 'id'> = {
  title: '',
  imageUrl: '/assets/images/logo.png',
  price: 0,
  originalPrice: 0,
  soldCount: 0,
  storeId: 'store_001',
  tags: [],
  description: '',
  validityStart: '2026-05-01',
  validityEnd: '2026-12-31',
  rules: [],
  content: [],
};

export default function AdminProductEdit() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Omit<Product, 'id'> & { id?: string }>(DEFAULT_PRODUCT);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    const pages = Taro.getCurrentPages?.() || [];
    const currentPage = pages[pages.length - 1];
    const options = (currentPage as any)?.options || {};
    const productStr = options.product;

    if (productStr) {
      try {
        const parsed = JSON.parse(decodeURIComponent(productStr));
        setProduct(parsed);
        setTagsInput((parsed.tags || []).join(', '));
      } catch (e) {
        console.error('Failed to parse product:', e);
      }
    }
  }, []);

  const handleSave = async () => {
    if (!product.title) {
      Taro.showToast({ title: 'Please enter product title' });
      return;
    }

    if (product.price <= 0) {
      Taro.showToast({ title: 'Please enter valid price' });
      return;
    }

    setLoading(true);

    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

      const productData: any = {
        ...product,
        tags,
        status: 'published',
        type: product.price >= 100 ? 'service' : 'physical',
        deliveryMethod: product.price >= 100 ? 'download' : 'ship',
        category: tags.includes('ticket') || tags.includes('experience') ? 'experiences' : 'fruits',
      };

      Taro.showModal({
        title: product.id ? 'Product Updated' : 'Product Created',
        content: `To save "${productData.title}", add this to public/config/app.json:\n\n${JSON.stringify(productData, null, 2)}`,
        confirmText: 'Copy JSON',
        success: (res) => {
          if (res.confirm) {
            Taro.setClipboardData({
              data: JSON.stringify(productData, null, 2),
              success: () => {
                Taro.showToast({ title: 'Copied! Paste into app.json' });
                setTimeout(() => Taro.navigateTo({ url: '/pages/admin/products/index' }), 1500);
              },
            });
          }
        },
      });
    } catch (err) {
      console.error('Save error:', err);
      Taro.showToast({ title: 'Failed to prepare product data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="admin-product-edit">
      <View className="admin-product-edit__header">
        <Text className="admin-product-edit__title">
          {product.id ? 'Edit Product' : 'Add Product'}
        </Text>
        <Text className="admin-product-edit__subtitle">Config-Driven (AppShell)</Text>
      </View>

      <View className="admin-product-edit__form">
        <View className="admin-product-edit__field">
          <Text className="admin-product-edit__label">Title *</Text>
          <Input
            className="admin-product-edit__input"
            type="text"
            placeholder="e.g., Organic Apple Box (5kg)"
            value={product.title}
            onInput={(e) => setProduct({ ...product, title: e.detail.value })}
          />
        </View>

        <View className="admin-product-edit__row">
          <View className="admin-product-edit__field admin-product-edit__field--half">
            <Text className="admin-product-edit__label">Price (¥) *</Text>
            <Input
              className="admin-product-edit__input"
              type="number"
              placeholder="0"
              value={product.price > 0 ? String(product.price) : ''}
              onInput={(e) => setProduct({ ...product, price: Number(e.detail.value) || 0 })}
            />
          </View>
          <View className="admin-product-edit__field admin-product-edit__field--half">
            <Text className="admin-product-edit__label">Original Price (¥)</Text>
            <Input
              className="admin-product-edit__input"
              type="number"
              placeholder="0"
              value={product.originalPrice > 0 ? String(product.originalPrice) : ''}
              onInput={(e) => setProduct({ ...product, originalPrice: Number(e.detail.value) || 0 })}
            />
          </View>
        </View>

        <View className="admin-product-edit__field">
          <Text className="admin-product-edit__label">Image URL</Text>
          <Input
            className="admin-product-edit__input"
            type="text"
            placeholder="/assets/images/logo.png"
            value={product.imageUrl}
            onInput={(e) => setProduct({ ...product, imageUrl: e.detail.value })}
          />
        </View>

        <View className="admin-product-edit__field">
          <Text className="admin-product-edit__label">Description</Text>
          <Input
            className="admin-product-edit__input"
            type="text"
            placeholder="Product description..."
            value={product.description}
            onInput={(e) => setProduct({ ...product, description: e.detail.value })}
          />
        </View>

        <View className="admin-product-edit__field">
          <Text className="admin-product-edit__label">Tags (comma separated)</Text>
          <Input
            className="admin-product-edit__input"
            type="text"
            placeholder="e.g., organic, fresh, family-pack"
            value={tagsInput}
            onInput={(e) => setTagsInput(e.detail.value)}
          />
        </View>

        <View className="admin-product-edit__row">
          <View className="admin-product-edit__field admin-product-edit__field--half">
            <Text className="admin-product-edit__label">Valid From</Text>
            <Input
              className="admin-product-edit__input"
              type="text"
              placeholder="YYYY-MM-DD"
              value={product.validityStart}
              onInput={(e) => setProduct({ ...product, validityStart: e.detail.value })}
            />
          </View>
          <View className="admin-product-edit__field admin-product-edit__field--half">
            <Text className="admin-product-edit__label">Valid Until</Text>
            <Input
              className="admin-product-edit__input"
              type="text"
              placeholder="YYYY-MM-DD"
              value={product.validityEnd}
              onInput={(e) => setProduct({ ...product, validityEnd: e.detail.value })}
            />
          </View>
        </View>

        <View className="admin-product-edit__actions">
          <Button className="admin-product-edit__cancel-btn" onClick={() => Taro.navigateTo({ url: '/pages/admin/products/index' })}>
            Cancel
          </Button>
          <Button
            className="admin-product-edit__save-btn"
            type="primary"
            loading={loading}
            onClick={handleSave}
          >
            Generate Config JSON
          </Button>
        </View>
      </View>
    </View>
  );
}
