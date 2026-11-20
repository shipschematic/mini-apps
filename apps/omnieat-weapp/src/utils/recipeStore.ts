import { request } from './request'
import Taro from '@tarojs/taro'

export interface Recipe {
  id: string
  title: string
  subtitle: string
  estimatedTime: string
  quantity: string
  imageUrl: string
  authorName: string
  categoryId: string
  category?: {
    id: string
    name: string
    icon: string
  }
  creator?: {
    id: string
    name: string
    avatar: string
  }
  views: number
  rating: number
  ingredients?: string
  steps?: string
  status?: string
  createdAt?: string
}

class RecipeStore {
  private recipes: Recipe[] = []
  private listeners: Set<(recipes: Recipe[]) => void> = new Set()
  private loading = false

  // Subscribe to recipe updates
  subscribe(listener: (recipes: Recipe[]) => void): () => void {
    this.listeners.add(listener)
    listener(this.recipes)
    return () => this.listeners.delete(listener)
  }

  // Get all recipes (from cache or fetch fresh)
  async getAll(forceRefresh = false): Promise<Recipe[]> {
    if (this.loading) {
      return this.recipes
    }

    if (!forceRefresh && this.recipes.length > 0) {
      return this.recipes
    }

    try {
      this.loading = true
      const recipes = await request({ url: '/api/recipes' })
      this.recipes = recipes || []
      this.notifyListeners()
      return this.recipes
    } catch (err: any) {
      console.error('[RecipeStore] Failed to fetch recipes:', err)
      throw err
    } finally {
      this.loading = false
    }
  }

  // Get recipe by ID
  async getById(id: string): Promise<Recipe | undefined> {
    const cached = this.recipes.find(r => r.id === id)
    if (cached) {
      return cached
    }

    try {
      const recipe = await request({ url: `/api/recipes/${id}` })
      // Update cache
      const index = this.recipes.findIndex(r => r.id === id)
      if (index >= 0) {
        this.recipes[index] = recipe
      } else {
        this.recipes.push(recipe)
      }
      this.notifyListeners()
      return recipe
    } catch (err: any) {
      console.error('[RecipeStore] Failed to fetch recipe:', err)
      throw err
    }
  }

  // Get recipes by category
  async getByCategory(categoryId: string): Promise<Recipe[]> {
    await this.getAll()
    return this.recipes.filter(r => r.categoryId === categoryId)
  }

  // Search recipes
  async search(query: string): Promise<Recipe[]> {
    try {
      const recipes = await request({ url: `/api/recipes?search=${encodeURIComponent(query)}` })
      this.recipes = recipes || []
      this.notifyListeners()
      return this.recipes
    } catch (err: any) {
      console.error('[RecipeStore] Search failed:', err)
      throw err
    }
  }

  // Create new recipe
  async create(recipeData: Partial<Recipe>): Promise<Recipe> {
    try {
      const newRecipe = await request({
        url: '/api/recipes',
        method: 'POST',
        data: recipeData
      })
      this.recipes.unshift(newRecipe)
      this.notifyListeners()
      Taro.showToast({ title: 'Recipe created!', icon: 'success' })
      return newRecipe
    } catch (err: any) {
      console.error('[RecipeStore] Create failed:', err)
      Taro.showToast({ title: 'Failed to create recipe', icon: 'none' })
      throw err
    }
  }

  // Update recipe
  async update(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    try {
      const updatedRecipe = await request({
        url: `/api/recipes/${id}`,
        method: 'PUT',
        data: updates
      })
      const index = this.recipes.findIndex(r => r.id === id)
      if (index >= 0) {
        this.recipes[index] = { ...this.recipes[index], ...updatedRecipe }
        this.notifyListeners()
      }
      Taro.showToast({ title: 'Recipe updated!', icon: 'success' })
      return updatedRecipe
    } catch (err: any) {
      console.error('[RecipeStore] Update failed:', err)
      Taro.showToast({ title: 'Failed to update recipe', icon: 'none' })
      throw err
    }
  }

  // Delete recipe
  async delete(id: string): Promise<void> {
    try {
      await request({
        url: `/api/recipes/${id}`,
        method: 'DELETE'
      })
      this.recipes = this.recipes.filter(r => r.id !== id)
      this.notifyListeners()
      Taro.showToast({ title: 'Recipe deleted', icon: 'success' })
    } catch (err: any) {
      console.error('[RecipeStore] Delete failed:', err)
      Taro.showToast({ title: 'Failed to delete recipe', icon: 'none' })
      throw err
    }
  }

  // Get user's recipes
  async getUserRecipes(): Promise<Recipe[]> {
    try {
      const recipes = await request({ url: '/api/users/recipes' })
      this.recipes = recipes || []
      this.notifyListeners()
      return this.recipes
    } catch (err: any) {
      console.error('[RecipeStore] Get user recipes failed:', err)
      throw err
    }
  }

  // Get fresh data from server
  async getFresh(notify = true): Promise<Recipe[]> {
    try {
      const recipes = await request({ url: '/api/recipes' })
      this.recipes = recipes || []
      if (notify) {
        this.notifyListeners()
      }
      return this.recipes
    } catch (err: any) {
      console.error('[RecipeStore] Get fresh failed:', err)
      throw err
    }
  }

  // Get current recipes (synchronous, no fetch)
  getRecipes(): Recipe[] {
    return [...this.recipes]
  }

  // Private: Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.recipes]))
  }
}

// Singleton instance
export const recipeStore = new RecipeStore()
