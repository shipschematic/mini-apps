import { request } from './request'
import Taro from '@tarojs/taro'

export interface Category {
  id: string
  name: string
  icon: string
  _count?: {
    recipes: number
  }
}

class CategoryStore {
  private categories: Category[] = []
  private listeners: Set<(categories: Category[]) => void> = new Set()
  private loading = false

  // Subscribe to category updates
  subscribe(listener: (categories: Category[]) => void): () => void {
    this.listeners.add(listener)
    listener(this.categories)
    return () => this.listeners.delete(listener)
  }

  // Get all categories (from cache or fetch fresh)
  async getAll(forceRefresh = false): Promise<Category[]> {
    if (this.loading) {
      return this.categories
    }

    if (!forceRefresh && this.categories.length > 0) {
      return this.categories
    }

    try {
      this.loading = true
      const categories = await request({ url: '/api/categories' })
      this.categories = categories || []
      this.notifyListeners()
      return this.categories
    } catch (err: any) {
      console.error('[CategoryStore] Failed to fetch categories:', err)
      throw err
    } finally {
      this.loading = false
    }
  }

  // Get category by ID
  getById(id: string): Category | undefined {
    return this.categories.find(c => c.id === id)
  }

  // Get category by name
  getByName(name: string): Category | undefined {
    return this.categories.find(c => c.name === name)
  }

  // Get fresh data from server
  async getFresh(notify = true): Promise<Category[]> {
    try {
      const categories = await request({ url: '/api/categories' })
      this.categories = categories || []
      if (notify) {
        this.notifyListeners()
      }
      return this.categories
    } catch (err: any) {
      console.error('[CategoryStore] Get fresh failed:', err)
      throw err
    }
  }

  // Get current categories (synchronous, no fetch)
  getCategories(): Category[] {
    return [...this.categories]
  }

  // Private: Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.categories]))
  }
}

// Singleton instance
export const categoryStore = new CategoryStore()
