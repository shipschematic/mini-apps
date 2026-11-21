import { useEffect, useState } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Product } from '../../core/types/product'
import { AppShell } from '../../core/AppShell'
import { CategoryFilter } from '../../components/CategoryFilter'
import { SearchBar } from '../../components/SearchBar'
import { store } from '../../store'
import './index.scss'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, activeCategory, searchQuery])

  const loadProducts = () => {
    try {
      const config = AppShell.getConfigSafe()
      if (config?.products && config.products.length > 0) {
        setProducts(config.products)
        setFilteredProducts(config.products)
      }
    } catch (e) {
      console.error('Failed to load products:', e)
    }
    setLoading(false)
  }

  const filterProducts = () => {
    let result = [...products]

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(result)
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleProductClick = (product: Product) => {
    const productId = product.id || product._id
    if (productId) {
      Taro.navigateTo({ url: `/pages/detail/index?id=${productId}` })
    }
  }

  const handleProductAction = (product: Product) => {
    const productId = product.id || product._id
    const deliveryMethod = product.deliveryMethod || 'download'

    if (deliveryMethod === 'ship') {
      store.dispatch({
        type: 'cart/add',
        payload: {
          productId: productId,
          quantity: 1,
          price: product.price,
          data: product
        }
      })
      Taro.showToast({ title: 'Added to cart', icon: 'success' })
    } else {
      Taro.navigateTo({ url: `/pages/detail/index?id=${productId}` })
    }
  }

  if (loading) {
    return (
      <View className="home-page">
        <View className="loading">Loading...</View>
      </View>
    )
  }

  return (
    <View className="home-page">
      <SearchBar onSearch={handleSearch} placeholder="Search prompts..." />
      <CategoryFilter onCategoryChange={handleCategoryChange} activeCategory={activeCategory} />

      <ScrollView scrollY className="products-scroll">
        {filteredProducts.length > 0 ? (
          <View className="products-grid">
            {filteredProducts.map((product) => (
              <View
                key={product.id || product._id}
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <View className="product-card__header">
                  <View className="product-card__type-badge">
                    <Text className="product-card__type-icon">📦</Text>
                    <Text className="product-card__type-label">{product.type || 'Digital'}</Text>
                  </View>
                  {product.rating && (
                    <View className="product-card__rating">
                      <Text className="product-card__rating-icon">⭐</Text>
                      <Text className="product-card__rating-value">{product.rating}</Text>
                    </View>
                  )}
                </View>

                <View className="product-card__image-placeholder">
                  <Text className="product-card__image-icon">📦</Text>
                </View>

                <View className="product-card__content">
                  <Text className="product-card__title" numberOfLines={2}>
                    {product.title || 'Untitled'}
                  </Text>

                  {product.category && (
                    <View className="product-card__category">
                      <Text className="product-card__category-text">{product.category}</Text>
                    </View>
                  )}

                  {product.description && (
                    <Text className="product-card__preview" numberOfLines={2}>
                      {product.description}
                    </Text>
                  )}

                  <View className="product-card__delivery">
                    <Text className="product-card__delivery-icon">📥</Text>
                    <Text className="product-card__delivery-text">
                      {product.deliveryMethod === 'ship' ? 'Shipping' : 'Instant Download'}
                    </Text>
                  </View>

                  <View className="product-card__footer">
                    <View className="product-card__price">
                      <Text className="product-card__price-symbol">¥</Text>
                      <Text className="product-card__price-value">{product.price}</Text>
                    </View>

                    <View
                      className="product-card__action-btn"
                      onClick={(e) => { e.stopPropagation(); handleProductAction(product) }}
                    >
                      <Text className="product-card__action-text">
                        {product.deliveryMethod === 'ship' ? 'Add to Cart' : 'Buy'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="empty-state">
            <Text className="empty-icon">📦</Text>
            <Text className="empty-text">No products found</Text>
            <Text className="empty-hint">Try changing the category or search term</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
