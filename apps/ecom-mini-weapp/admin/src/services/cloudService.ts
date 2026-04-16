const CLOUD_ENV_ID = import.meta.env.VITE_CLOUD_ENV_ID || 'your-env-id'
const CLOUD_BASE_URL = `https://${CLOUD_ENV_ID}.service.tcloudbase.com`

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

async function callCloudFunction<T>(functionName: string, data: any = {}): Promise<CloudResult<T>> {
  try {
    const response = await fetch(`${CLOUD_BASE_URL}/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result as CloudResult<T>
  } catch (error: any) {
    console.error(`Cloud function ${functionName} error:`, error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export const adminCloudService = {
  async getProducts(filters?: {
    status?: string
    type?: string
    category?: string
  }): Promise<CloudResult<Product[]>> {
    return callCloudFunction<Product[]>('getProducts', filters || {})
  },

  async createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<CloudResult<Product>> {
    return callCloudFunction<Product>('createProduct', { product })
  },

  async updateProduct(productId: string, updates: Partial<Product>): Promise<CloudResult<any>> {
    return callCloudFunction('updateProduct', { productId, updates })
  },

  async deleteProduct(productId: string): Promise<CloudResult<any>> {
    return callCloudFunction('deleteProduct', { productId })
  },

  async getOrders(filters?: {
    status?: string
    limit?: number
    skip?: number
  }): Promise<CloudResult<Order[]>> {
    return callCloudFunction<Order[]>('getOrders', filters || {})
  },

  async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'paid' | 'failed' | 'refunded',
    transactionId?: string
  ): Promise<CloudResult<any>> {
    return callCloudFunction('updateOrderStatus', { orderId, status, transactionId })
  },

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${CLOUD_BASE_URL}/uploadFile`, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    return result.fileID
  },
}

export type { Product, Order, CloudResult }
