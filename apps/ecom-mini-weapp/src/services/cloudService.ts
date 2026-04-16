import Taro from '@tarojs/taro'

interface CloudResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

interface Product {
  _id: string
  title: string
  description: string
  price: number
  type: 'digital' | 'service' | 'physical'
  deliveryMethod: 'download' | 'unlock' | 'ship'
  preview: string
  fullContent?: string
  downloadUrl?: string
  cover: string
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
      const result = await Taro.cloud.callFunction({
        name: 'getProducts',
        data: filters || {}
      })
      
      return result.result as CloudResult<Product[]>
    } catch (error: any) {
      console.error('Get products error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  async createOrder(items: Array<{
    productId: string
    title: string
    price: number
    quantity: number
  }>, total?: number, discount?: number): Promise<CloudResult<{ orderId: string; order: Order }>> {
    try {
      const result = await Taro.cloud.callFunction({
        name: 'createOrder',
        data: { items, total, discount }
      })
      
      return result.result as CloudResult<{ orderId: string; order: Order }>
    } catch (error: any) {
      console.error('Create order error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  async getUserPurchases(): Promise<CloudResult<Purchase[]>> {
    try {
      const result = await Taro.cloud.callFunction({
        name: 'getUserPurchases',
        data: {}
      })
      
      return result.result as CloudResult<Purchase[]>
    } catch (error: any) {
      console.error('Get user purchases error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  async uploadFile(filePath: string, cloudPath?: string): Promise<string> {
    try {
      const finalCloudPath = cloudPath || `uploads/${Date.now()}_${filePath.split('/').pop()}`
      
      const result = await Taro.cloud.uploadFile({
        cloudPath: finalCloudPath,
        filePath: filePath
      })
      
      return result.fileID
    } catch (error: any) {
      console.error('Upload file error:', error)
      throw error
    }
  }
  
  async deleteFile(fileList: string[]): Promise<void> {
    try {
      await Taro.cloud.deleteFile({
        fileList: fileList
      })
    } catch (error: any) {
      console.error('Delete file error:', error)
      throw error
    }
  }
  
  async getTempFileURL(fileList: string[]): Promise<string[]> {
    try {
      const result = await Taro.cloud.getTempFileURL({
        fileList: fileList
      })
      
      return result.fileList.map((file: any) => file.tempFileURL)
    } catch (error: any) {
      console.error('Get temp file URL error:', error)
      throw error
    }
  }
}

export const cloudService = new CloudService()
export type { Product, Order, Purchase, CloudResult }
