import Taro from '@tarojs/taro'
import { AppConfig, MetaConfig, PageConfig } from './types'

/**
 * ConfigParser - Validates and parses JSON configuration
 * Single Source of Truth for app structure
 */

const DEFAULT_CONFIG_URL = '/config/app.json'

export class ConfigParser {
  private static config: AppConfig | null = null
  private static pageMap: Map<string, PageConfig> = new Map()

  /**
   * Load configuration from URL or default location
   */
  static async loadConfig(url: string = DEFAULT_CONFIG_URL): Promise<AppConfig> {
    try {
      const response = await Taro.request({
        url,
        method: 'GET'
      })
      
      const rawConfig = response.data
      
      this.config = this.validate(rawConfig)
      this.buildPageMap()
      this.applyTheme(this.config.meta)
      
      return this.config
    } catch (error) {
      console.error('Failed to load config:', error)
      throw new Error(`Config load failed: ${error}`)
    }
  }

  /**
   * Load config from local file (for development)
   */
  static async loadLocalConfig(configObj: AppConfig): Promise<AppConfig> {
    this.config = this.validate(configObj)
    this.buildPageMap()
    this.applyTheme(this.config.meta)
    
    return this.config
  }

  /**
   * Validate configuration structure
   */
  static validate(config: any): AppConfig {
    if (!config.meta) {
      throw new Error('Config missing required "meta" section')
    }

    if (!config.pages || !Array.isArray(config.pages)) {
      throw new Error('Config missing required "pages" array')
    }

    // Validate each page
    config.pages.forEach((page: any, index: number) => {
      if (!page.id) {
        throw new Error(`Page at index ${index} missing required "id"`)
      }
      if (!page.dataSource) {
        throw new Error(`Page "${page.id}" missing required "dataSource"`)
      }
    })

    return config as AppConfig
  }

  /**
   * Build page lookup map for O(1) access
   */
  private static buildPageMap(): void {
    this.pageMap.clear()
    
    if (!this.config) return

    this.config.pages.forEach(page => {
      this.pageMap.set(page.id, page)
    })
  }

  /**
   * Apply theme from meta config
   */
  private static applyTheme(meta: MetaConfig): void {
    // In Mini Program there is no DOM; set CSS variables via page style
    const page = Taro.getCurrentInstance().page
    if (page) {
      const styleVars: Record<string, string> = {
        '--primary-color': meta.primaryColor,
      }
      if (meta.secondaryColor) {
        styleVars['--secondary-color'] = meta.secondaryColor
      }
      if (meta.theme?.borderRadius) {
        styleVars['--border-radius'] = meta.theme.borderRadius
      }
      if (meta.theme?.fontFamily) {
        styleVars['--font-family'] = meta.theme.fontFamily
      }
      // Apply via page root style (supported in Taro 3.x+)
      // CSS variables work when defined on :root or page in SCSS
      // Store them for components to reference
      ;(page as any).__themeVars = styleVars
    }
  }

  /**
   * Get full configuration
   */
  static getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Config not loaded. Call loadConfig() first.')
    }
    return this.config
  }

  /**
   * Get page configuration by ID
   */
  static getPage(pageId: string): PageConfig | undefined {
    return this.pageMap.get(pageId)
  }

  /**
   * Get all pages
   */
  static getPages(): PageConfig[] {
    return this.config?.pages || []
  }

  /**
   * Get meta configuration
   */
  static getMeta(): MetaConfig {
    return this.config?.meta || {} as MetaConfig
  }

  /**
   * Check if feature is enabled
   */
  static hasFeature(feature: string): boolean {
    return this.config?.meta.features.includes(feature) || false
  }

  /**
   * Reset config (for testing)
   */
  static reset(): void {
    this.config = null
    this.pageMap.clear()
  }
}
