import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Input, Image } from '@tarojs/components'
import { adminCloudService, Product } from '../../../services/adminService'
import './products.scss'

const DELIVERY_METHODS = ['download', 'unlock', 'ship']
const PRODUCT_TYPES = ['digital', 'service', 'physical']
const STATUS_OPTIONS = ['published', 'draft', 'archived']

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    type: 'digital' as const,
    deliveryMethod: 'download' as const,
    cover: '',
    category: '',
    status: 'draft' as const
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await adminCloudService.getProducts()
      if (res.success && res.data) {
        setProducts(res.data)
      }
    } catch (err) {
      console.error('Load products error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setFormData({
      title: '',
      description: '',
      price: 0,
      type: 'digital',
      deliveryMethod: 'download',
      cover: '',
      category: '',
      status: 'draft'
    })
    setShowForm(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      type: product.type,
      deliveryMethod: product.deliveryMethod,
      cover: product.cover,
      category: product.category,
      status: product.status
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      Taro.showLoading({ title: 'Saving...' })

      let res
      if (editingProduct) {
        res = await adminCloudService.updateProduct(editingProduct._id, formData)
      } else {
        res = await adminCloudService.createProduct(formData)
      }

      if (res.success) {
        Taro.showToast({ title: 'Saved!', icon: 'success' })
        setShowForm(false)
        loadProducts()
      } else {
        Taro.showToast({ title: res.error || 'Failed', icon: 'none' })
      }
    } catch (err) {
      Taro.showToast({ title: 'Error', icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  }

  const handleDelete = async (productId: string) => {
    const confirm = await Taro.showModal({
      title: 'Delete Product',
      content: 'Are you sure you want to delete this product?'
    })

    if (confirm.confirm) {
      try {
        const res = await adminCloudService.deleteProduct(productId)
        if (res.success) {
          Taro.showToast({ title: 'Deleted', icon: 'success' })
          loadProducts()
        }
      } catch (err) {
        Taro.showToast({ title: 'Error', icon: 'none' })
      }
    }
  }

  const handleChooseImage = async () => {
    try {
      const res = await Taro.chooseImage({ count: 1 })
      const tempFilePath = res.tempFilePaths[0]

      // Upload to cloud
      Taro.showLoading({ title: 'Uploading...' })
      const cloudPath = await adminCloudService.uploadImage(tempFilePath)
      setFormData(prev => ({ ...prev, cover: cloudPath }))
      Taro.hideLoading()
    } catch (err) {
      Taro.hideLoading()
      Taro.showToast({ title: 'Upload failed', icon: 'none' })
    }
  }

  // Form Modal
  if (showForm) {
    return (
      <View className="product-form-modal">
        <View className="form-header">
          <Text className="form-title">{editingProduct ? 'Edit Product' : 'New Product'}</Text>
          <Text onClick={() => setShowForm(false)}>Cancel</Text>
        </View>

        <ScrollView scrollY className="form-content">
          <View className="form-group">
            <Text className="label">Title</Text>
            <Input
              value={formData.title}
              onInput={(e: any) => setFormData(prev => ({ ...prev, title: e.detail.value }))}
              placeholder="Product title"
            />
          </View>

          <View className="form-group">
            <Text className="label">Description</Text>
            <Input
              value={formData.description}
              onInput={(e: any) => setFormData(prev => ({ ...prev, description: e.detail.value }))}
              placeholder="Product description"
              type="textarea"
            />
          </View>

          <View className="form-group">
            <Text className="label">Price (¥)</Text>
            <Input
              value={String(formData.price)}
              onInput={(e: any) => setFormData(prev => ({ ...prev, price: Number(e.detail.value) }))}
              type="number"
              placeholder="0.00"
            />
          </View>

          <View className="form-group">
            <Text className="label">Type</Text>
            <View className="selector">
              {PRODUCT_TYPES.map(type => (
                <Text
                  key={type}
                  className={`selector-item ${formData.type === type ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, type: type as any }))}
                >
                  {type}
                </Text>
              ))}
            </View>
          </View>

          <View className="form-group">
            <Text className="label">Delivery</Text>
            <View className="selector">
              {DELIVERY_METHODS.map(method => (
                <Text
                  key={method}
                  className={`selector-item ${formData.deliveryMethod === method ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: method as any }))}
                >
                  {method}
                </Text>
              ))}
            </View>
          </View>

          <View className="form-group">
            <Text className="label">Cover Image</Text>
            <View className="cover-upload" onClick={handleChooseImage}>
              {formData.cover ? (
                <Image src={formData.cover} className="cover-preview" />
              ) : (
                <Text className="upload-placeholder">Tap to upload</Text>
              )}
            </View>
          </View>

          <View className="form-group">
            <Text className="label">Category</Text>
            <Input
              value={formData.category}
              onInput={(e: any) => setFormData(prev => ({ ...prev, category: e.detail.value }))}
              placeholder="e.g. Books, Courses"
            />
          </View>

          <View className="form-group">
            <Text className="label">Status</Text>
            <View className="selector">
              {STATUS_OPTIONS.map(status => (
                <Text
                  key={status}
                  className={`selector-item ${formData.status === status ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, status: status as any }))}
                >
                  {status}
                </Text>
              ))}
            </View>
          </View>

          <View className="form-actions">
            <View className="save-btn" onClick={handleSave}>Save Product</View>
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <View className="admin-products">
      <View className="products-header">
        <Text className="count">{products.length} Products</Text>
        <View className="add-btn" onClick={handleAddNew}>+ Add</View>
      </View>

      <ScrollView scrollY className="products-list">
        {products.map(product => (
          <View key={product._id} className="product-card">
            <Image src={product.cover} className="product-cover" />
            <View className="product-info">
              <Text className="product-title">{product.title}</Text>
              <Text className="product-price">¥{product.price.toFixed(2)}</Text>
              <View className="product-meta">
                <Text className={`status status-${product.status}`}>{product.status}</Text>
                <Text className="type">{product.type}</Text>
              </View>
            </View>
            <View className="product-actions">
              <Text className="action edit" onClick={() => handleEdit(product)}>Edit</Text>
              <Text className="action delete" onClick={() => handleDelete(product._id)}>Delete</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
