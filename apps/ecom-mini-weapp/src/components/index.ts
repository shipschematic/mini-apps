/**
 * Component Registration
 * Register all whitelabel components on app startup
 */

import { ComponentRegistry } from '../core/ComponentRegistry'
import ProductCard from './ProductCard'
import ServiceCard from './ServiceCard'
import UserInfo from './UserInfo'
import OrderHistory from './OrderHistory'
import DigitalLibrary from './DigitalLibrary'
import CartView from './CartView'
import ProductDetail from './ProductDetail'
import LockedContent from './LockedContent'

// Register all components
ComponentRegistry.registerMany([
  {
    name: 'ProductCard',
    component: ProductCard,
    config: {
      props: {
        pricePrefix: '¥',
        showDescription: false
      }
    }
  },
  {
    name: 'ServiceCard',
    component: ServiceCard,
    config: {
      props: {
        pricePrefix: '¥',
        showPreview: true,
        showUsageCount: true
      }
    }
  },
  {
    name: 'UserInfo',
    component: UserInfo,
    config: {
      props: {}
    }
  },
  {
    name: 'OrderHistory',
    component: OrderHistory,
    config: {
      props: {}
    }
  },
  {
    name: 'DigitalLibrary',
    component: DigitalLibrary,
    config: {
      props: {}
    }
  },
  {
    name: 'CartView',
    component: CartView,
    config: {
      props: {}
    }
  },
  {
    name: 'ProductDetail',
    component: ProductDetail,
    config: {
      props: {}
    }
  },
  {
    name: 'LockedContent',
    component: LockedContent,
    config: {
      props: {}
    }
  }
])

console.log('Components registered:', ComponentRegistry.getNames())
