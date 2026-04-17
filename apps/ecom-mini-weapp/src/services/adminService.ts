import Taro from '@tarojs/taro'
import { Product } from '../core/types/product'
import { Order } from './cloudService'

interface CloudResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

class AdminCloudService {
  private _db: any = null

  private get db(): any {
    if (!this._db) {
      if (typeof Taro.cloud === 'undefined') {
        throw new Error('Cloud not initialized')
      }
      this._db = Taro.cloud.database()
    }
    return this._db
  }

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
      return { success: false, error: error.message }
    }
  }

  async deleteProduct(id: string): Promise<CloudResult<void>> {
    try {
      await this.db.collection('products').doc(id).remove()
      return { success: true }
    } catch (error: any) {
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
      return { success: false, error: error.message }
    }
  }

  async saveStoreConfig(config: any): Promise<CloudResult<void>> {
    try {
      await this.db.collection('config').doc('store').set({ data: config })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}

export const adminCloudService = new AdminCloudService()
