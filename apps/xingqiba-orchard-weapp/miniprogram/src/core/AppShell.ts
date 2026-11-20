import Taro from '@tarojs/taro'

export interface AppConfig {
  meta: {
    appName: string
    primaryColor: string
    secondaryColor: string
    currency: string
    locale: string
    features: string[]
    adminIds: string[]
  }
  categories: Array<{
    id: string
    name: string
    icon: string
  }>
  products: Array<{
    id: string
    title: string
    description: string
    price: number
    originalPrice: number
    type: string
    deliveryMethod: string
    category: string
    status: string
    imageUrl?: string
    soldCount?: number
    tags?: string[]
    validityStart?: string
    validityEnd?: string
    content?: Array<{ name: string; count: string }>
    rules?: Array<{ label: string; value: string }>
  }>
}

let config: AppConfig | null = null
let initialized = false

class AppShell {
  static async loadConfig(): Promise<AppConfig> {
    if (config) return config
    throw new Error('Use loadLocalConfig() instead. Direct request is not supported in WeChat Mini Program.')
  }

  static async loadLocalConfig(configObj: AppConfig): Promise<AppConfig> {
    if (initialized) {
      return config as AppConfig
    }
    config = configObj
    initialized = true
    console.log('[AppShell] Config loaded:', config.meta.appName)
    return config
  }

  static getConfig(): AppConfig {
    if (!config) throw new Error('Config not loaded. Call loadLocalConfig() first.')
    return config
  }

  static getConfigSafe(): AppConfig | null {
    return config
  }

  static getProducts(): AppConfig['products'] {
    return config?.products || []
  }

  static getCategories(): AppConfig['categories'] {
    return config?.categories || []
  }

  static getMeta() {
    return config?.meta || {}
  }

  static isInitialized(): boolean {
    return initialized
  }

  static reset(): void {
    config = null
    initialized = false
  }
}

export { AppShell }
export default AppShell
