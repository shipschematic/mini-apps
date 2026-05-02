import Taro from '@tarojs/taro'
import { Product } from '../core/types/product'

export type { Product } from '../core/types/product'

interface CloudResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

interface Order {
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
    status: 'pending' | 'paid' | 'failed' | 'refunded'
    transactionId: string | null
    paidAt: string | null
  }
  createdAt: string
  updatedAt: string
}

interface Purchase {
  productId: string
  orderId: string
  purchasedAt: string
  price: number
  title: string
  product?: Product
}

class CloudService {
  async getProducts(filters?: {
    status?: string
    type?: string
    category?: string
  }): Promise<CloudResult<Product[]>> {
    try {
      if (typeof Taro.cloud === 'undefined' || !Taro.cloud.callFunction) {
        console.error('Cloud not available')
        return { success: false, error: 'Cloud not available' }
      }
      console.log('Calling getProducts cloud function...')
      const result = await Taro.cloud.callFunction({
        name: 'getProducts',
        data: filters || {}
      })
      console.log('Cloud function result:', result)
      
      return result.result as CloudResult<Product[]>
    } catch (error: any) {
      console.error('Cloud function error:', error)
      return { success: false, error: error.message }
    }
  }
  
  async createOrder(items: Array<{
    productId: string
    title: string
    price: number
    quantity: number
  }>, total?: number, discount?: number): Promise<CloudResult<{ orderId: string; order: Order }>> {
    try {
      if (typeof Taro.cloud === 'undefined' || !Taro.cloud.callFunction) {
        return { success: false, error: 'Cloud not available' }
      }
      const result = await Taro.cloud.callFunction({
        name: 'createOrder',
        data: { items, total, discount }
      })
      
      return result.result as CloudResult<{ orderId: string; order: Order }>
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
  
  async getUserPurchases(): Promise<CloudResult<Purchase[]>> {
    try {
      if (typeof Taro.cloud === 'undefined' || !Taro.cloud.callFunction) {
        return { success: false, error: 'Cloud not available' }
      }
      const result = await Taro.cloud.callFunction({
        name: 'getUserPurchases',
        data: {}
      })
      
      return result.result as CloudResult<Purchase[]>
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
  
  async uploadFile(filePath: string, cloudPath?: string): Promise<string> {
    try {
      if (typeof Taro.cloud === 'undefined') {
        throw new Error('Cloud not available')
      }
      const finalCloudPath = cloudPath || `uploads/${Date.now()}_${filePath.split('/').pop()}`
      
      const result = await Taro.cloud.uploadFile({
        cloudPath: finalCloudPath,
        filePath: filePath
      })
      
      return result.fileID
    } catch (error: any) {
      throw error
    }
  }
  
  async deleteFile(fileList: string[]): Promise<void> {
    try {
      if (typeof Taro.cloud === 'undefined') {
        throw new Error('Cloud not available')
      }
      await Taro.cloud.deleteFile({
        fileList: fileList
      })
    } catch (error: any) {
      throw error
    }
  }
  
  async getTempFileURL(fileList: string[]): Promise<string[]> {
    try {
      if (typeof Taro.cloud === 'undefined') {
        throw new Error('Cloud not available')
      }
      const result = await Taro.cloud.getTempFileURL({
        fileList: fileList
      })
      
      return result.fileList.map((file: any) => file.tempFileURL)
    } catch (error: any) {
      throw error
    }
  }
}

export const cloudService = new CloudService()
export { CloudService }
export type { Order, Purchase, CloudResult }
