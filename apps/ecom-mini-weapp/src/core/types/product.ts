/**
 * Product Type - Single Source of Truth
 * All product-related types and configs live here.
 * Other files MUST import from this file, never re-declare.
 */

export type ProductType = 'digital' | 'service' | 'physical'
export type DeliveryMethod = 'download' | 'unlock' | 'ship'
export type ProductStatus = 'published' | 'draft' | 'archived'

export interface Product {
  id?: string
  _id?: string
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
  tags?: string[]

  preview?: string
  fullContent?: string
  downloadUrl?: string

  inventory?: number
  sku?: string
  status?: ProductStatus
  purchaseCount?: number
  viewCount?: number

  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
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

export const PRODUCT_TYPE_CONFIG: Record<ProductType, { icon: string; label: string; deliveryMethod: DeliveryMethod; actionText: string }> = {
  digital: {
    icon: '📦',
    label: 'Digital Product',
    deliveryMethod: 'download',
    actionText: 'Download'
  },
  service: {
    icon: '⚡',
    label: 'Service',
    deliveryMethod: 'unlock',
    actionText: 'Unlock'
  },
  physical: {
    icon: '🚚',
    label: 'Physical Product',
    deliveryMethod: 'ship',
    actionText: 'Add to Cart'
  }
}

export const DELIVERY_METHOD_CONFIG: Record<DeliveryMethod, { icon: string; label: string; description: string }> = {
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
