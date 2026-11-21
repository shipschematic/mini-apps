import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Input, Button } from '@tarojs/components'
import { Product } from '../../core/types/product'
import { AppShell } from '../../core/AppShell'
import './admin.scss'

const STORAGE_KEY = 'pending_products_json'

interface PendingChange {
  type: 'add' | 'edit' | 'delete'
  product: Product
  timestamp: number
}

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([])
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: 0,
    type: 'digital',
    deliveryMethod: 'download',
    category: '',
    cover: '/assets/images/logo.png',
    status: 'published'
  })

  useEffect(() => {
    loadProducts()
    loadPendingChanges()
  }, [])

  const loadProducts = () => {
    const config = AppShell.getConfigSafe()
    if (config?.products) {
      setProducts(config.products)
    }
  }

  const loadPendingChanges = () => {
    try {
      const stored = Taro.getStorageSync(STORAGE_KEY)
      if (stored) {
        setPendingChanges(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load pending changes:', e)
    }
  }

  const savePendingChanges = (changes: PendingChange[]) => {
    try {
      Taro.setStorageSync(STORAGE_KEY, JSON.stringify(changes))
      setPendingChanges(changes)
    } catch (e) {
      console.error('Failed to save pending changes:', e)
    }
  }

  const handleAdd = () => {
    setShowAddForm(true)
    setEditingProduct(null)
    setFormData({
      title: '',
      description: '',
      price: 0,
      type: 'digital',
      deliveryMethod: 'download',
      category: '',
      cover: '/assets/images/logo.png',
      status: 'published'
    })
  }

  const handleEdit = (product: Product) => {
    setShowAddForm(true)
    setEditingProduct(product)
    setFormData({ ...product })
  }

  const handleDelete = (product: Product) => {
    Taro.showModal({
      title: 'Delete Product',
      content: `Are you sure you want to delete "${product.title}"? This will be pending until you update the JSON.`,
      success: (res) => {
        if (res.confirm) {
          const change: PendingChange = {
            type: 'delete',
            product,
            timestamp: Date.now()
          }
          savePendingChanges([...pendingChanges, change])
          Taro.showToast({ title: 'Delete queued', icon: 'success' })
        }
      }
    })
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.description || formData.price === undefined) {
      Taro.showToast({ title: 'Please fill required fields', icon: 'none' })
      return
    }

    const newProduct: Product = {
      ...formData,
      id: editingProduct?.id || `prod-${Date.now()}`,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Product

    const change: PendingChange = {
      type: editingProduct ? 'edit' : 'add',
      product: newProduct,
      timestamp: Date.now()
    }

    savePendingChanges([...pendingChanges, change])
    setShowAddForm(false)
    Taro.showToast({ title: 'Change queued', icon: 'success' })
  }

  const exportConfig = () => {
    const config = AppShell.getConfigSafe()
    if (!config) {
      Taro.showToast({ title: 'Config not loaded', icon: 'error' })
      return
    }
    const jsonStr = JSON.stringify(config, null, 2)
    Taro.setClipboardData({
      data: jsonStr,
      success: () => {
        Taro.showToast({ title: 'JSON copied to clipboard', icon: 'success' })
      }
    })
  }

  const clearPendingChanges = () => {
    Taro.showModal({
      title: 'Clear Pending Changes',
      content: 'Are you sure you want to clear all pending changes?',
      success: (res) => {
        if (res.confirm) {
          savePendingChanges([])
          Taro.showToast({ title: 'Cleared', icon: 'success' })
        }
      }
    })
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published': return '#10b981'
      case 'draft': return '#f59e0b'
      case 'archived': return '#6b7280'
      default: return '#6b7280'
    }
  }

  return (
    <View className="admin-container">
      <View className="admin-header">
        <Text className="admin-title">Store Admin</Text>
        <Text className="admin-subtitle">{AppShell.getConfigSafe()?.meta?.appName || 'My Store'}</Text>
      </View>

      <View className="admin-actions">
        <Button className="action-btn primary" onClick={handleAdd}>+ Add Product</Button>
        <Button className="action-btn secondary" onClick={exportConfig}>Export JSON</Button>
      </View>

      {pendingChanges.length > 0 && (
        <View className="pending-section">
          <View className="pending-header">
            <Text className="pending-title">Pending Changes ({pendingChanges.length})</Text>
            <Button className="clear-btn" onClick={clearPendingChanges}>Clear All</Button>
          </View>
          <ScrollView className="pending-list" scrollY>
            {pendingChanges.map((change, index) => (
              <View key={change.timestamp} className="pending-item">
                <Text className="pending-type">{change.type.toUpperCase()}</Text>
                <Text className="pending-name">{change.product.title}</Text>
                <Text className="pending-time">{new Date(change.timestamp).toLocaleTimeString()}</Text>
              </View>
            ))}
          </ScrollView>
          <Text className="pending-note">
            Copy the JSON after making changes, edit public/config/prompt-service.json, then rebuild.
          </Text>
        </View>
      )}

      <ScrollView className="products-list" scrollY>
        <Text className="section-title">Current Products ({products.length})</Text>
        {products.map((product) => (
          <View key={product.id || product._id} className="product-item">
            <View className="product-info">
              <Text className="product-title">{product.title}</Text>
              <Text className="product-price">¥{product.price}</Text>
              <View className="product-meta">
                <Text 
                  className="product-status"
                  style={{ backgroundColor: getStatusColor(product.status) }}
                >
                  {product.status || 'published'}
                </Text>
                <Text className="product-category">{product.category || 'uncategorized'}</Text>
              </View>
            </View>
            <View className="product-actions">
              <Button className="edit-btn" onClick={() => handleEdit(product)}>Edit</Button>
              <Button className="delete-btn" onClick={() => handleDelete(product)}>Delete</Button>
            </View>
          </View>
        ))}
      </ScrollView>

      {showAddForm && (
        <View className="modal-overlay">
          <View className="modal-content">
            <Text className="modal-title">{editingProduct ? 'Edit Product' : 'Add Product'}</Text>
            
            <View className="form-group">
              <Text className="form-label">Title *</Text>
              <Input
                className="form-input"
                value={formData.title || ''}
                onInput={(e) => setFormData({ ...formData, title: e.detail.value })}
                placeholder="Product title"
              />
            </View>

            <View className="form-group">
              <Text className="form-label">Description *</Text>
              <Input
                className="form-input"
                value={formData.description || ''}
                onInput={(e) => setFormData({ ...formData, description: e.detail.value })}
                placeholder="Product description"
              />
            </View>

            <View className="form-group">
              <Text className="form-label">Price *</Text>
              <Input
                className="form-input"
                type="number"
                value={formData.price?.toString() || '0'}
                onInput={(e) => setFormData({ ...formData, price: parseFloat(e.detail.value) || 0 })}
                placeholder="0"
              />
            </View>

            <View className="form-group">
              <Text className="form-label">Category</Text>
              <Input
                className="form-input"
                value={formData.category || ''}
                onInput={(e) => setFormData({ ...formData, category: e.detail.value })}
                placeholder="e.g., productivity, health"
              />
            </View>

            <View className="form-group">
              <Text className="form-label">Type</Text>
              <View className="radio-group">
                <Text 
                  className={`radio-option ${formData.type === 'digital' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, type: 'digital' })}
                >
                  Digital
                </Text>
                <Text 
                  className={`radio-option ${formData.type === 'service' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, type: 'service' })}
                >
                  Service
                </Text>
                <Text 
                  className={`radio-option ${formData.type === 'physical' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, type: 'physical' })}
                >
                  Physical
                </Text>
              </View>
            </View>

            <View className="form-group">
              <Text className="form-label">Status</Text>
              <View className="radio-group">
                <Text 
                  className={`radio-option ${formData.status === 'published' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, status: 'published' })}
                >
                  Published
                </Text>
                <Text 
                  className={`radio-option ${formData.status === 'draft' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, status: 'draft' })}
                >
                  Draft
                </Text>
              </View>
            </View>

            <View className="modal-buttons">
              <Button className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button className="submit-btn" onClick={handleSubmit}>
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
