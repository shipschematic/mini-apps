import Taro from '@tarojs/taro'
import { AppConfig } from './types'

class ConfigManager {
  private static config: AppConfig | null = null
  private static pageMap: Map<string, any> = new Map()

  static loadConfig(url?: string): Promise<AppConfig> {
    const configUrl = url || '/config/app.json'
    return Taro.request({ url: configUrl, method: 'GET' })
      .then(res => {
        const data = res.data as AppConfig
        ConfigManager.config = ConfigManager.validate(data)
        ConfigManager.buildPageMap()
        ConfigManager.applyTheme(ConfigManager.config.meta)
        return ConfigManager.config
      })
      .catch(err => {
        console.error('Failed to load config:', err)
        throw new Error('Config load failed: ' + err)
      })
  }

  static loadLocalConfig(configObj: AppConfig): AppConfig {
    ConfigManager.config = ConfigManager.validate(configObj)
    ConfigManager.buildPageMap()
    ConfigManager.applyTheme(ConfigManager.config.meta)
    return ConfigManager.config
  }

  static validate(config: any): AppConfig {
    if (!config.meta) throw new Error('Config missing required "meta" section')
    if (!config.pages || !Array.isArray(config.pages)) throw new Error('Config missing required "pages" array')
    config.pages.forEach((page: any, i: number) => {
      if (!page.id) throw new Error('Page at index ' + i + ' missing required "id"')
      if (!page.dataSource) throw new Error('Page "' + page.id + '" missing required "dataSource"')
    })
    return config
  }

  private static buildPageMap() {
    ConfigManager.pageMap.clear()
    if (ConfigManager.config && ConfigManager.config.pages) {
      ConfigManager.config.pages.forEach((page: any) => {
        ConfigManager.pageMap.set(page.id, page)
      })
    }
  }

  private static applyTheme(meta: any) {
    try {
      const inst = Taro.getCurrentInstance()
      const page = inst?.page
      if (page) {
        const vars: Record<string, string> = { '--primary-color': meta.primaryColor }
        if (meta.secondaryColor) vars['--secondary-color'] = meta.secondaryColor
        if (meta.theme?.borderRadius) vars['--border-radius'] = meta.theme.borderRadius
        if (meta.theme?.fontFamily) vars['--font-family'] = meta.theme.fontFamily
        ;(page as any).__themeVars = vars
      }
    } catch (_) {}
  }

  static getConfig(): AppConfig {
    if (!ConfigManager.config) throw new Error('Config not loaded. Call loadConfig() first.')
    return ConfigManager.config
  }

  static getConfigSafe(): AppConfig | null {
    return ConfigManager.config
  }

  static getPage(pageId: string) {
    return ConfigManager.pageMap.get(pageId)
  }

  static getPages() {
    return ConfigManager.config?.pages || []
  }

  static getMeta() {
    return ConfigManager.config?.meta || {} as any
  }

  static hasFeature(feature: string): boolean {
    return ConfigManager.config?.meta.features.includes(feature) || false
  }

  static reset() {
    ConfigManager.config = null
    ConfigManager.pageMap.clear()
  }
}

export class AppShell {
  private static initialized = false

  static async loadConfig(configUrl?: string): Promise<AppConfig> {
    if (AppShell.initialized) {
      return ConfigManager.getConfig()
    }
    const config = await ConfigManager.loadConfig(configUrl)
    AppShell.initialized = true
    console.log('AppShell initialized with config:', config.meta.appName)
    return config
  }

  static async loadLocalConfig(configObj: AppConfig): Promise<AppConfig> {
    if (AppShell.initialized) {
      return ConfigManager.getConfig()
    }
    const config = ConfigManager.loadLocalConfig(configObj)
    AppShell.initialized = true
    console.log('AppShell initialized with local config:', config.meta.appName)
    return config
  }

  static getConfig(): AppConfig {
    return ConfigManager.getConfig()
  }

  static getConfigSafe(): AppConfig | null {
    return ConfigManager.getConfigSafe()
  }

  static getPage(pageId: string) {
    return ConfigManager.getPage(pageId)
  }

  static hasFeature(feature: string): boolean {
    return ConfigManager.hasFeature(feature)
  }

  static isInitialized(): boolean {
    return AppShell.initialized
  }

  static reset(): void {
    ConfigManager.reset()
    AppShell.initialized = false
  }
}
