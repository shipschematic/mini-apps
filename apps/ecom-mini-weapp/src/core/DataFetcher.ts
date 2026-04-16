import Taro from '@tarojs/taro'
import { DataSource, DataTransformer } from './types'
import { store } from '../store'
import { ConfigParser } from './ConfigParser'

/**
 * DataFetcher - Unified data fetching from multiple sources
 * Supports API, static data, store, and custom functions
 */

const transformers: Map<string, DataTransformer> = new Map()
const functions: Map<string, Function> = new Map()

export class DataFetcher {
  /**
   * Register a custom data transformer
   */
  static registerTransformer(name: string, transform: (data: any) => any): void {
    transformers.set(name, { name, transform })
  }

  /**
   * Register a custom function for data fetching
   */
  static registerFunction(name: string, fn: Function): void {
    functions.set(name, fn)
  }

  /**
   * Fetch data from configured source
   */
  static async fetch(source: DataSource, params?: Record<string, any>): Promise<any> {
    switch (source.type) {
      case 'api':
        return this.fetchAPI(source, params)
      case 'static':
        return this.fetchStatic(source)
      case 'store':
        return this.fetchFromStore(source)
      case 'function':
        return this.fetchFromFunction(source, params)
      default:
        throw new Error(`Unknown data source type: ${source.type}`)
    }
  }

  /**
   * Fetch from API endpoint
   */
  private static async fetchAPI(source: DataSource, params?: Record<string, any>): Promise<any> {
    if (!source.endpoint) {
      throw new Error('API endpoint required')
    }

    // Replace template parameters (e.g., {{params.id}})
    const endpoint = this.interpolateParams(source.endpoint, params)

    try {
      const response = await Taro.request({
        url: endpoint,
        method: source.method || 'GET',
        header: source.headers,
        data: source.body || params
      })

      let data = response.data

      // Apply transformer if specified
      if (source.transformer) {
        data = this.applyTransformer(source.transformer, data)
      }

      return data
    } catch (error) {
      console.error('API fetch failed:', error)
      throw new Error(`API fetch failed: ${error}`)
    }
  }

  /**
   * Fetch static data from config
   */
  private static fetchStatic(source: DataSource): any {
    if (!source.data) {
      throw new Error('Static data source requires "data" property')
    }
    return source.data
  }

  /**
   * Fetch from global store
   */
  private static fetchFromStore(source: DataSource): any {
    if (!source.prop) {
      throw new Error('Store data source requires "prop" property')
    }

    const state = store.getState() as Record<string, any>
    const keys = source.prop.split('.')
    
    let data: any = state
    for (const key of keys) {
      data = data[key]
      if (data === undefined) {
        throw new Error(`Store path "${source.prop}" not found`)
      }
    }

    return data
  }

  /**
   * Fetch from custom function
   */
  private static async fetchFromFunction(source: DataSource, params?: Record<string, any>): Promise<any> {
    // Check if it's a registered function
    if (source.function && functions.has(source.function)) {
      const fn = functions.get(source.function)
      if (fn) {
        return fn(params)
      }
    }

    // Fallback to transformer
    if (source.transformer) {
      const transformer = transformers.get(source.transformer)
      if (transformer) {
        return transformer.transform(params)
      }
    }

    throw new Error(`Function "${source.function || source.transformer}" not found`)
  }

  /**
   * Interpolate template parameters in URL
   * Example: /api/books/{{params.id}} → /api/books/123
   */
  private static interpolateParams(template: string, params?: Record<string, any>): string {
    if (!params) return template

    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const keys = path.split('.')
      let value: any = params

      for (const key of keys) {
        value = value?.[key]
      }

      return value !== undefined ? String(value) : match
    })
  }

  /**
   * Apply transformer to data
   */
  private static applyTransformer(transformerName: string, data: any): any {
    const transformer = transformers.get(transformerName)
    if (!transformer) {
      console.warn(`Transformer "${transformerName}" not found, returning raw data`)
      return data
    }

    return transformer.transform(data)
  }
}

// Register default transformers
DataFetcher.registerTransformer('identity', (data) => data)
DataFetcher.registerTransformer('array', (data) => Array.isArray(data) ? data : [data])
DataFetcher.registerTransformer('lowercase', (data) => 
  typeof data === 'string' ? data.toLowerCase() : data
)

// Register default functions
DataFetcher.registerFunction('getProductById', (params: Record<string, any>) => {
  const productId = params?.id
  if (!productId) {
    throw new Error('Product ID required')
  }

  const config = ConfigParser.getConfig()
  const products = config?.products || []
  const product = products.find((p: any) => p.id === productId)

  if (!product) {
    throw new Error(`Product "${productId}" not found`)
  }

  return { product }
})
