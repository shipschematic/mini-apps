export type ProductType = 'digital' | 'service' | 'physical'
export type DeliveryMethod = 'download' | 'unlock' | 'ship'

export interface Product {
  id: string
  title: string
  description: string
  price: number
  type: ProductType
  deliveryMethod: DeliveryMethod
  
  cover?: string
  author?: string
  category?: string
  rating?: number
  reviewCount?: number
  
  preview?: string
  fullContent?: string
  downloadUrl?: string
  
  inventory?: number
  sku?: string
  
  metadata?: Record<string, any>
}

export interface ProductConfig {
  showPreview?: boolean
  showRating?: boolean
  showCategory?: boolean
  showAuthor?: boolean
  showInventory?: boolean
  pricePrefix?: string
  priceSuffix?: string
  unlockButtonText?: string
  downloadButtonText?: string
  addToCartButtonText?: string
}

export const PRODUCT_TYPE_CONFIG = {
  digital: {
    icon: '📦',
    label: 'Digital Product',
    deliveryMethod: 'download' as DeliveryMethod,
    actionText: 'Download'
  },
  service: {
    icon: '⚡',
    label: 'Service',
    deliveryMethod: 'unlock' as DeliveryMethod,
    actionText: 'Unlock'
  },
  physical: {
    icon: '🚚',
    label: 'Physical Product',
    deliveryMethod: 'ship' as DeliveryMethod,
    actionText: 'Add to Cart'
  }
}

export const DELIVERY_METHOD_CONFIG = {
  download: {
    icon: '📥',
    label: 'Instant Download',
    description: 'Download immediately after purchase'
  },
  unlock: {
    icon: '🔓',
    label: 'Instant Access',
    description: 'Unlock content immediately after purchase'
  },
  ship: {
    icon: '🚚',
    label: 'Shipping',
    description: 'Delivered to your address'
  }
}
