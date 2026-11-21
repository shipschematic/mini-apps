/**
 * Single Source of Truth: Favorite State Manager
 * 
 * Principles:
 * 1. Data lives in ONE place (this store)
 * 2. All changes go through dispatcher
 * 3. Components subscribe to changes, never mutate directly
 * 4. Server is the source of truth, cache is derived
 */

type FavoriteListener = (ids: string[]) => void

class FavoriteStore {
  private favoritedIds: string[] = []
  private listeners: Set<FavoriteListener> = new Set()
  private loading = false
  private lastFetchedAt: number = 0
  private readonly CACHE_DURATION = 5000 // 5 seconds

  /**
   * Subscribe to favorite changes
   */
  subscribe(listener: FavoriteListener): () => void {
    this.listeners.add(listener)
    // Immediately notify with current state
    listener(this.favoritedIds)
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Get current favorite IDs (from cache)
   */
  getIds(): string[] {
    return [...this.favoritedIds]
  }

  /**
   * Check if recipe is favorited
   */
  isFavorited(recipeId: string): boolean {
    return this.favoritedIds.includes(recipeId)
  }

  /**
   * Force refresh from server (bypass cache)
   */
  async refresh(): Promise<string[]> {
    if (this.loading) {
      console.log('[FavoriteStore] Refresh already in progress')
      return this.favoritedIds
    }

    this.loading = true
    console.log('[FavoriteStore] Fetching from server...')

    try {
      const { request } = await import('../utils/request')
      const ids = await request({ url: '/api/saved?ids=true' }) || []
      
      console.log('[FavoriteStore] Server returned', ids.length, 'IDs')
      this.favoritedIds = ids
      this.lastFetchedAt = Date.now()
      this.notifyListeners()
      
      return ids
    } catch (err: any) {
      console.error('[FavoriteStore] Refresh failed:', err.message)
      throw err
    } finally {
      this.loading = false
    }
  }

  /**
   * Get fresh data from server (with optional cache)
   */
  async getFresh(forceRefresh = false): Promise<string[]> {
    const now = Date.now()
    const isStale = now - this.lastFetchedAt > this.CACHE_DURATION

    if (!forceRefresh && !isStale && this.favoritedIds.length > 0) {
      console.log('[FavoriteStore] Using cache (age:', now - this.lastFetchedAt, 'ms)')
      return this.favoritedIds
    }

    return this.refresh()
  }

  /**
   * Add recipe to favorites
   */
  async add(recipeId: string): Promise<void> {
    console.log('[FavoriteStore] Adding recipe', recipeId)
    
    try {
      const { request } = await import('../utils/request')
      await request({ url: '/api/saved', method: 'POST', data: { recipeId } })
      
      // Optimistic update
      if (!this.favoritedIds.includes(recipeId)) {
        this.favoritedIds = [...this.favoritedIds, recipeId]
        this.notifyListeners()
      }
      
      // Then sync with server
      await this.refresh()
    } catch (err: any) {
      console.error('[FavoriteStore] Add failed:', err.message)
      throw err
    }
  }

  /**
   * Remove recipe from favorites
   */
  async remove(recipeId: string): Promise<void> {
    console.log('[FavoriteStore] Removing recipe', recipeId)
    
    try {
      const { request } = await import('../utils/request')
      await request({ url: '/api/saved', method: 'DELETE', data: { recipeId } })
      
      // Optimistic update
      this.favoritedIds = this.favoritedIds.filter(id => id !== recipeId)
      this.notifyListeners()
      
      // Then sync with server
      await this.refresh()
    } catch (err: any) {
      console.error('[FavoriteStore] Remove failed:', err.message)
      throw err
    }
  }

  /**
   * Toggle favorite status
   */
  async toggle(recipeId: string): Promise<void> {
    const isLiked = this.isFavorited(recipeId)
    console.log('[FavoriteStore] Toggle recipe', recipeId, 'currently:', isLiked ? 'LIKED' : 'NOT LIKED')
    
    if (isLiked) {
      await this.remove(recipeId)
    } else {
      await this.add(recipeId)
    }
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    console.log('[FavoriteStore] Notifying', this.listeners.size, 'listeners. IDs:', this.favoritedIds)
    this.listeners.forEach(listener => listener([...this.favoritedIds]))
  }

  /**
   * Clear cache (for logout)
   */
  clear(): void {
    console.log('[FavoriteStore] Clearing cache')
    this.favoritedIds = []
    this.lastFetchedAt = 0
    this.notifyListeners()
  }
}

// Singleton instance
export const favoriteStore = new FavoriteStore()
