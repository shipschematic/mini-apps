import Taro from '@tarojs/taro'

interface CloudResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface Product {
  _id: string
  title: string
  description: string
  price: number
  type: 'digital' | 'service' | 'physical'
  deliveryMethod: 'download' | 'unlock' | 'ship'
  cover: string
  preview?: string
  fullContent?: string
  downloadUrl?: string
  author: string
  category: string
  tags: string[]
  rating: number
  reviewCount: number
  purchaseCount: number
  viewCount: number
  status: 'published' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface Order {
  _id: string
  userId: string
  items: Array<{
    productId: string
    title: string
    price: number
    quantity: number
  }>
  subtotal: number
  discount: number
  total: number
  payment: {
    method: string
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'refunded' | 'failed'
    transactionId: string | null
    paidAt: string | null
  }
  shipping?: {
    address: string
    phone: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

class AdminCloudService {
  private db = Taro.cloud.database()

  // ============ Products ============

  async getProducts(filters?: {
    status?: string
    type?: string
    category?: string
  }): Promise<CloudResult<Product[]>> {
    try {
      let query: any = this.db.collection('products')

      if (filters?.status) {
        query = query.where({ status: filters.status })
      }
      if (filters?.type) {
        query = query.where({ type: filters.type })
      }

      const res = await query.get()

      return {
        success: true,
        data: res.data as Product[]
      }
    } catch (error: any) {
      console.error('Get products error:', error)
      return { success: false, error: error.message }
    }
  }

  async createProduct(data: Partial<Product>): Promise<CloudResult<Product>> {
    try {
      const now = new Date().toISOString()
      const res = await this.db.collection('products').add({
        data: {
          ...data,
          createdAt: now,
          updatedAt: now,
          rating: 0,
          reviewCount: 0,
          purchaseCount: 0,
          viewCount: 0,
          tags: data.tags || []
        }
      })

      return {
        success: true,
        data: { _id: res._id, ...data } as Product
      }
    } catch (error: any) {
      console.error('Create product error:', error)
      return { success: false, error: error.message }
    }
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<CloudResult<Product>> {
    try {
      await this.db.collection('products').doc(id).update({
        data: {
          ...data,
          updatedAt: new Date().toISOString()
        }
      })

      return { success: true }
    } catch (error: any) {
      console.error('Update product error:', error)
      return { success: false, error: error.message }
    }
  }

  async deleteProduct(id: string): Promise<CloudResult<void>> {
    try {
      await this.db.collection('products').doc(id).remove()
      return { success: true }
    } catch (error: any) {
      console.error('Delete product error:', error)
      return { success: false, error: error.message }
    }
  }

  // ============ Orders ============

  async getOrders(filters?: {
    status?: string
    userId?: string
  }): Promise<CloudResult<Order[]>> {
    try {
      let query: any = this.db.collection('orders')

      if (filters?.status) {
        query = query.where({ 'payment.status': filters.status })
      }
      if (filters?.userId) {
        query = query.where({ userId: filters.userId })
      }

      const res = await query.orderBy('createdAt', 'desc').get()

      return {
        success: true,
        data: res.data as Order[]
      }
    } catch (error: any) {
      console.error('Get orders error:', error)
      return { success: false, error: error.message }
    }
  }

  async updateOrderStatus(
    id: string,
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'refunded'
  ): Promise<CloudResult<void>> {
    try {
      await this.db.collection('orders').doc(id).update({
        data: {
          'payment.status': status,
          updatedAt: new Date().toISOString()
        }
      })

      return { success: true }
    } catch (error: any) {
      console.error('Update order status error:', error)
      return { success: false, error: error.message }
    }
  }

  // ============ File Upload ============

  async uploadImage(filePath: string): Promise<string> {
    const cloudPath = `products/${Date.now()}_${filePath.split('/').pop()}`

    const res = await Taro.cloud.uploadFile({
      cloudPath,
      filePath
    })

    // Get temp URL
    const urlRes = await Taro.cloud.getTempFileURL({
      fileList: [res.fileID]
    })

    return urlRes.fileList[0].tempFileURL || res.fileID
  }

  // ============ Store Config ============

  async getStoreConfig(): Promise<CloudResult<any>> {
    try {
      const res = await this.db.collection('config').doc('store').get()

      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.error('Get store config error:', error)
      return { success: false, error: error.message }
    }
  }

  async saveStoreConfig(config: any): Promise<CloudResult<void>> {
    try {
      await this.db.collection('config').doc('store').set({ data: config })
      return { success: true }
    } catch (error: any) {
      console.error('Save store config error:', error)
      return { success: false, error: error.message }
    }
  }
}

export const adminCloudService = new AdminCloudService()
