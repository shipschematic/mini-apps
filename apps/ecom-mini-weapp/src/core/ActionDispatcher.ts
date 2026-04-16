import Taro from '@tarojs/taro'
import { Action, ActionHandler, ActionRegistry, DispatchContext } from './types'
import { store } from '../store'
import { ConfigParser } from './ConfigParser'

/**
 * ActionDispatcher - Processes action arrays from config
 * Executes actions sequentially with support for async operations
 */

const actionRegistry: ActionRegistry = {
  // Navigation actions
  navigate: async (payload: any, context: DispatchContext) => {
    const target = payload.target || payload.url
    console.log('[ActionDispatcher] navigate called:', { target, payload, context })
    
    // Check if target is a tabbar page
    const tabbarPages = ['home', 'cart', 'profile']
    const isTabbarPage = tabbarPages.includes(target)
    
    if (isTabbarPage) {
      // For tabbar pages, use switchTab
      const url = `/pages/${target === 'home' ? 'dynamic' : target}/index`
      console.log('[ActionDispatcher] Switching to tabbar page:', url)
      await Taro.switchTab({ url })
    } else {
      // For non-tabbar pages (like detail), use navigateTo
      // First, interpolate all params
      const interpolatedParams: Record<string, any> = {}
      
      if (payload.params) {
        Object.entries(payload.params).forEach(([key, value]) => {
          if (typeof value === 'string' && value.includes('{{')) {
            // Extract template variable
            const match = value.match(/\{\{(.*?)\}\}/)
            if (match) {
              const path = match[1].split('.')
              console.log('[ActionDispatcher] Template path:', path)
              
              // Determine which context to use based on first path segment
              let data: any
              let remainingPath: string[]
              
              if (path[0] === 'item' && context.componentContext?.item) {
                data = context.componentContext.item
                remainingPath = path.slice(1) // Skip 'item' since we already have it
              } else if (path[0] === 'data' && context.componentContext?.data) {
                data = context.componentContext.data
                remainingPath = path.slice(1) // Skip 'data'
              } else {
                // Fallback: try both
                data = context.componentContext?.item || context.componentContext?.data
                remainingPath = path
              }
              
              console.log('[ActionDispatcher] Extracting:', { data, remainingPath })
              
              // Traverse the remaining path
              for (const p of remainingPath) {
                data = data?.[p]
              }
              
              interpolatedParams[key] = data || value
              console.log('[ActionDispatcher] Extracted param:', { key, value: interpolatedParams[key] })
            } else {
              interpolatedParams[key] = value
            }
          } else {
            interpolatedParams[key] = value
          }
        })
      }
      
      // Build URL with interpolated params
      // The 'id' param should be the product ID, not the page ID
      const queryString = new URLSearchParams(interpolatedParams).toString()
      const url = `/pages/detail/index?${queryString}`
      
      console.log('[ActionDispatcher] Navigating to detail page:', url)

      if (payload.type === 'redirectTo') {
        await Taro.redirectTo({ url })
      } else if (payload.type === 'reLaunch') {
        await Taro.reLaunch({ url })
      } else {
        await Taro.navigateTo({ url })
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
    await Taro.switchTab({
      url: `/pages/dynamic/index?id=${target}`
    })
  },

  // Cart actions
  addToCart: async (payload: any, context: DispatchContext) => {
    console.log('[ActionDispatcher] addToCart called:', { payload, context })
    const { id, productId, quantity, variant, price, title, cover, author, description, ...rest } = payload
    
    const cartItem = {
      productId: id || productId,
      quantity: quantity || 1,
      variant,
      price,
      data: {
        id: id || productId,
        title,
        price,
        cover,
        author,
        description,
        ...rest
      }
    }
    
    console.log('[ActionDispatcher] Adding to cart:', cartItem)
    
    store.dispatch({
      type: 'cart/add',
      payload: cartItem
    })
    
    console.log('[ActionDispatcher] Cart state after add:', store.getState().cart)
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
    console.log('[ActionDispatcher] purchase called:', { payload, context })
    
    // In a real app, this would:
    // 1. Call payment API (WeChat Pay)
    // 2. Verify payment
    // 3. Grant access to digital content
    
    // For demo, we'll just add to purchased items
    const { productId, price, title } = payload
    
    // Simulate payment processing
    await Taro.showLoading({ title: 'Processing payment...' })
    await new Promise(resolve => setTimeout(resolve, 1500))
    Taro.hideLoading()
    
    // Add to user's purchased items
    store.dispatch({
      type: 'user/addPurchase',
      payload: {
        productId,
        purchaseDate: new Date().toISOString(),
        price,
        title
      }
    })
    
    console.log('[ActionDispatcher] Purchase completed:', { productId, price, title })
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
      console.error('API call failed:', error)
      
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
  console.log('[ActionDispatcher] Executing action:', action.type, action)
  const handler = actionRegistry[action.type]
  
  if (!handler) {
    console.warn(`Action "${action.type}" not found in registry`)
    return
  }

  try {
    await handler(action.payload, context)
  } catch (error) {
    console.error(`Action "${action.type}" failed:`, error)
    throw error
  }
}

/**
 * Execute array of actions sequentially
 */
export async function executeActions(actions: Action[], context: DispatchContext): Promise<void> {
  if (!actions || !Array.isArray(actions)) {
    console.warn('No actions to execute')
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
    console.log('[ActionDispatcher] dispatch called:', { actions, pageContext, componentContext })
    
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
