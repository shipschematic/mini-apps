import { request } from './request'
import Taro from '@tarojs/taro'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  createdAt?: string
}

class UserStore {
  private currentUser: User | null = null
  private listeners: Set<(user: User | null) => void> = new Set()
  private loading = false

  // Subscribe to user updates
  subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.add(listener)
    listener(this.currentUser)
    return () => this.listeners.delete(listener)
  }

  // Get current user
  async getCurrentUser(forceRefresh = false): Promise<User | null> {
    if (this.loading) {
      return this.currentUser
    }

    if (!forceRefresh && this.currentUser) {
      return this.currentUser
    }

    try {
      this.loading = true
      const user = await request({ url: '/api/users/me' })
      this.currentUser = user
      this.notifyListeners()
      return user
    } catch (err: any) {
      if (err.status === 401) {
        this.currentUser = null
        this.notifyListeners()
      }
      console.error('[UserStore] Failed to fetch user:', err)
      throw err
    } finally {
      this.loading = false
    }
  }

  // Get user by ID
  async getById(id: string): Promise<User | undefined> {
    try {
      const user = await request({ url: `/api/users/${id}` })
      return user
    } catch (err: any) {
      console.error('[UserStore] Failed to fetch user:', err)
      throw err
    }
  }

  // Update current user
  async update(updates: Partial<User>): Promise<User> {
    try {
      const updatedUser = await request({
        url: '/api/users/me',
        method: 'PUT',
        data: updates
      })
      this.currentUser = updatedUser
      this.notifyListeners()
      Taro.showToast({ title: 'Profile updated!', icon: 'success' })
      return updatedUser
    } catch (err: any) {
      console.error('[UserStore] Update failed:', err)
      Taro.showToast({ title: 'Failed to update profile', icon: 'none' })
      throw err
    }
  }

  // Logout
  logout(): void {
    this.currentUser = null
    this.notifyListeners()
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  // Get current user (synchronous)
  getUser(): User | null {
    return this.currentUser
  }

  // Private: Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser))
  }
}

// Singleton instance
export const userStore = new UserStore()
