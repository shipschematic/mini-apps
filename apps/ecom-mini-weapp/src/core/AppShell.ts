import { AppConfig } from './types'
import { ConfigParser } from './ConfigParser'

/**
 * AppShell - Main application container
 * Loads configuration and initializes the app
 */

export class AppShell {
  private static initialized = false

  /**
   * Load application configuration
   */
  static async loadConfig(configUrl?: string): Promise<AppConfig> {
    if (this.initialized) {
      console.warn('AppShell already initialized')
      return ConfigParser.getConfig()
    }

    try {
      const config = await ConfigParser.loadConfig(configUrl)
      this.initialized = true
      
      console.log('AppShell initialized with config:', config.meta.appName)
      
      return config
    } catch (error) {
      console.error('Failed to initialize AppShell:', error)
      throw error
    }
  }

  /**
   * Load local configuration (for development)
   */
  static async loadLocalConfig(configObj: AppConfig): Promise<AppConfig> {
    if (this.initialized) {
      console.warn('AppShell already initialized')
      return ConfigParser.getConfig()
    }

    const config = await ConfigParser.loadLocalConfig(configObj)
    this.initialized = true
    
    console.log('AppShell initialized with local config:', config.meta.appName)
    
    return config
  }

  /**
   * Get current configuration
   */
  static getConfig(): AppConfig {
    return ConfigParser.getConfig()
  }

  /**
   * Get page configuration
   */
  static getPage(pageId: string) {
    return ConfigParser.getPage(pageId)
  }

  /**
   * Check if feature is enabled
   */
  static hasFeature(feature: string): boolean {
    return ConfigParser.hasFeature(feature)
  }

  /**
   * Check if app is initialized
   */
  static isInitialized(): boolean {
    return this.initialized
  }

  /**
   * Reset app state (for testing)
   */
  static reset(): void {
    ConfigParser.reset()
    this.initialized = false
  }
}
