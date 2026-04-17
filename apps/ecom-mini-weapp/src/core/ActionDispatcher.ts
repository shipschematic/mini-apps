import Taro from '@tarojs/taro'
import { Action, ActionHandler, ActionRegistry, DispatchContext } from './types'
import { store } from '../store'
import { paymentService } from '../services/paymentService'

/**
 * ActionDispatcher - Processes action arrays from config
 * Executes actions sequentially with support for async operations
 */

const actionRegistry: ActionRegistry = {
  // Navigation actions
  navigate: async (payload: any, context: DispatchContext) => {
    const target = payload.target || payload.url
    
    // Handle specific targets
    if (target === 'checkout') {
      await Taro.switchTab({ url: '/pages/cart/index' })
      return
    }
    
    if (target === 'detail') {
      let productId = payload.id || payload.productId || payload.params?.id
      
      if (!productId) {
        const item = context?.componentContext?.item
        if (item) {
          productId = item.id || item._id || item.productId
        }
      }
      
      const url = productId ? `/pages/detail/index?id=${productId}` : '/pages/detail/index'
      await Taro.navigateTo({ url })
      return
    }
    
    // Check if target is a tabbar page
    const tabbarPages = ['home', 'cart', 'profile']
    const isTabbarPage = tabbarPages.includes(target)
    
    if (isTabbarPage) {
      const url = `/pages/${target === 'home' ? 'dynamic' : target}/index`
      await Taro.switchTab({ url })
    } else {
      const knownPages: Record<string, string> = {
        'admin': '/pages/admin/index',
        'dashboard': '/pages/admin/dashboard',
        'products': '/pages/admin/products',
        'orders': '/pages/admin/orders',
        'settings': '/pages/admin/settings',
        'detail': '/pages/detail/index',
        'cart': '/pages/cart/index',
        'profile': '/pages/profile/index'
      }
      
      const baseUrl = knownPages[target]
      
      if (baseUrl) {
        const interpolatedParams: Record<string, any> = {}
        
        if (payload.params) {
          Object.entries(payload.params).forEach(([key, value]) => {
            if (typeof value === 'string' && value.includes('{{')) {
              const match = value.match(/\{\{(.*?)\}\}/)
              if (match) {
                const path = match[1].split('.')
                let data: any = context?.componentContext?.item || context?.componentContext?.data
                
                for (const p of path.slice(1)) {
                  data = data?.[p]
                }
                interpolatedParams[key] = data || value
              } else {
                interpolatedParams[key] = value
              }
            } else {
              interpolatedParams[key] = value
            }
          })
        }
        
        const queryString = new URLSearchParams(interpolatedParams).toString()
        const url = queryString ? `${baseUrl}?${queryString}` : baseUrl
        
        await Taro.navigateTo({ url })
      } else {
        Taro.showToast({ title: 'Navigation error', icon: 'none' })
      }
    }
  },

  navigateBack: async (payload: any, context: DispatchContext) => {
    await Taro.navigateBack({
      delta: payload.delta || 1
    })
  },

  switchTab: async (payload: any, context: DispatchContext) => {
    const target = payload.target || payload.url
    const params = payload.params || {}
    
    // switchTab does NOT support query params in Mini Program
    // Store params in Redux so the target page can read them
    if (Object.keys(params).length > 0) {
      store.dispatch({
        type: 'storeConfig/update',
        payload: { _pendingTabParams: { target, params } }
      })
    }
    
    const tabMap: Record<string, string> = {
      home: '/pages/dynamic/index',
      cart: '/pages/cart/index',
      profile: '/pages/profile/index'
    }
    
    await Taro.switchTab({
      url: tabMap[target] || `/pages/${target}/index`
    })
  },

  // Cart actions
  addToCart: async (payload: any, context: DispatchContext) => {
    const { id, _id, productId, quantity, variant, price, title, cover, author, description, ...rest } = payload
    
    const resolvedId = id || _id || productId
    
    const cartItem = {
      productId: resolvedId,
      quantity: quantity || 1,
      variant,
      price,
      data: {
        id: resolvedId,
        title,
        price,
        cover,
        author,
        description,
        ...rest
      }
    }
    
    store.dispatch({
      type: 'cart/add',
      payload: cartItem
    })
  },

  removeFromCart: async (payload: any, context: DispatchContext) => {
    store.dispatch({
      type: 'cart/remove',
      payload: {
        itemId: payload.itemId || payload.id
      }
    })
  },

  updateCartQuantity: async (payload: any, context: DispatchContext) => {
    store.dispatch({
      type: 'cart/update',
      payload: {
        itemId: payload.itemId || payload.id,
        quantity: payload.quantity
      }
    })
  },

  clearCart: async (payload: any, context: DispatchContext) => {
    store.dispatch({
      type: 'cart/clear'
    })
  },

  // Wishlist actions
  addToWishlist: async (payload: any, context: DispatchContext) => {
    store.dispatch({
      type: 'wishlist/add',
      payload: {
        productId: payload.id || payload.productId,
        data: payload.data
      }
    })
  },

  removeFromWishlist: async (payload: any, context: DispatchContext) => {
    store.dispatch({
      type: 'wishlist/remove',
      payload: {
        itemId: payload.itemId || payload.id
      }
    })
  },

  // Purchase actions (for digital products/services)
  purchase: async (payload: any, context: DispatchContext) => {
    // Try to find product data from multiple sources
    let productId = payload?.productId || payload?.id || payload?._id
    let title = payload?.title
    let price = payload?.price
    
    // If not in payload, try context
    if (!productId) {
      const item = context?.componentContext?.item
      if (item) {
        productId = item.productId || item.id || item._id
        title = item.title || title
        price = item.price || price
      }
      
      if (!productId) {
        const pageData = context?.pageContext?.data
        if (pageData) {
          productId = pageData.productId || pageData.id || pageData._id
          title = pageData.title || title
          price = pageData.price || price
        }
      }
    }
    
    if (!productId) {
      Taro.showToast({ title: 'Product error - try reopening', icon: 'none' })
      return
    }
    
    // Use payment service (real WeChat Cloud Pay or simulated fallback)
    const result = await paymentService.quickPurchase({
      id: String(productId),
      title: title || 'Product',
      price: Number(price) || 0
    })
    
    if (!result.success && result.error !== 'cancelled') {
      Taro.showToast({ title: result.error || 'Payment failed', icon: 'none' })
    }
  },

  // Checkout action (cart -> payment)
  checkout: async (payload: any, context: DispatchContext) => {
    const cartState = store.getState().cart
    
    if (!cartState?.items || cartState.items.length === 0) {
      Taro.showToast({ title: 'Cart is empty', icon: 'none' })
      return
    }
    
    const items = cartState.items.map((item: any) => ({
      productId: item.productId || item.data?.id,
      title: item.data?.title || 'Product',
      price: item.data?.price || 0,
      quantity: item.quantity || 1
    }))
    
    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    
    const result = await paymentService.checkout(items, total)
    
    if (!result.success && result.error !== 'cancelled') {
      Taro.showToast({ title: result.error || 'Checkout failed', icon: 'none' })
    }
  },

  // User actions
  login: async (payload: any, context: DispatchContext) => {
    // WeChat login
    const { code } = await Taro.login()
    
    store.dispatch({
      type: 'user/login',
      payload: {
        code,
        ...payload
      }
    })
  },

  logout: async (payload: any, context: DispatchContext) => {
    store.dispatch({
      type: 'user/logout'
    })
  },

  updateUser: async (payload: any, context: DispatchContext) => {
    store.dispatch({
      type: 'user/update',
      payload
    })
  },

  // API actions
  apiCall: async (payload: any, context: DispatchContext) => {
    const { endpoint, method = 'POST', body, onSuccess, onError } = payload

    try {
      const response = await Taro.request({
        url: endpoint,
        method,
        data: body
      })

      if (onSuccess) {
        await executeActions(onSuccess, {
          ...context,
          responseData: response.data
        })
      }
    } catch (error) {
      if (onError) {
        await executeActions(onError, {
          ...context,
          error
        })
      }
    }
  },

  // Store actions
  setState: async (payload: any, context: DispatchContext) => {
    store.dispatch({
      type: payload.type,
      payload: payload.data
    })
  },

  // UI actions
  showToast: async (payload: any, context: DispatchContext) => {
    await Taro.showToast({
      title: payload.title || 'Success',
      icon: payload.icon || 'success',
      duration: payload.duration || 2000
    })
  },

  showLoading: async (payload: any, context: DispatchContext) => {
    await Taro.showLoading({
      title: payload.title || 'Loading...',
      mask: payload.mask !== false
    })
  },

  hideLoading: async (payload: any, context: DispatchContext) => {
    await Taro.hideLoading()
  },

  showModal: async (payload: any, context: DispatchContext) => {
    const result = await Taro.showModal({
      title: payload.title,
      content: payload.content,
      showCancel: payload.showCancel !== false,
      confirmText: payload.confirmText || 'Confirm',
      cancelText: payload.cancelText || 'Cancel'
    })

    if (result.confirm && payload.onConfirm) {
      await executeActions(payload.onConfirm, context)
    } else if (result.cancel && payload.onCancel) {
      await executeActions(payload.onCancel, context)
    }
  },

  // Clipboard
  setClipboardData: async (payload: any, context: DispatchContext) => {
    await Taro.setClipboardData({
      data: payload.data
    })
  },

  // Share
  share: async (payload: any, context: DispatchContext) => {
    await Taro.showShareMenu({
      withShareTicket: true,
      showShareItems: ['wechatFriends', 'wechatMoment']
    })
  },

  // Phone
  makePhoneCall: async (payload: any, context: DispatchContext) => {
    await Taro.makePhoneCall({
      phoneNumber: payload.phoneNumber
    })
  },

  // Preview image
  previewImage: async (payload: any, context: DispatchContext) => {
    const urls = Array.isArray(payload.urls) ? payload.urls : [payload.urls]
    await Taro.previewImage({
      urls,
      current: payload.current || 0
    })
  }
}

/**
 * Execute a single action
 */
async function executeAction(action: Action, context: DispatchContext): Promise<void> {
  const handler = actionRegistry[action.type]
  
  if (!handler) {
    Taro.showToast({ title: `Unknown action: ${action.type}`, icon: 'none' })
    return
  }

  try {
    await handler(action.payload, context)
  } catch (error) {
    throw error
  }
}

/**
 * Execute array of actions sequentially
 */
export async function executeActions(actions: Action[], context: DispatchContext): Promise<void> {
  if (!actions || !Array.isArray(actions)) {
    return
  }

  for (const action of actions) {
    await executeAction(action, context)
  }
}

/**
 * Dispatch actions from component with proper context
 */
export function dispatch(
  actions: Action[], 
  pageContext: { pageId: string; params?: Record<string, any>; data?: any },
  componentContext?: { componentId: string; data?: any; config?: any; pageContext?: any }
): () => Promise<void> {
  return async () => {
    const fullComponentContext = componentContext ? {
      ...componentContext,
      pageContext
    } : undefined
    
    const context: DispatchContext = {
      pageContext,
      componentContext: fullComponentContext,
      store
    }

    await executeActions(actions, context)
  }
}

/**
 * Register custom action handler
 */
export function registerAction(type: string, handler: ActionHandler): void {
  actionRegistry[type] = handler
}

/**
 * Get all registered actions (for debugging)
 */
export function getActionRegistry(): ActionRegistry {
  return { ...actionRegistry }
}
