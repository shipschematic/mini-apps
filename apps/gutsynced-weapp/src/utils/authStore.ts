import Taro from '@tarojs/taro'
import { request } from './request'

type Listener = () => void

class AuthStore {
  private email = ''
  private name = ''
  private listeners: Set<Listener> = new Set()

  constructor() {
    this.email = Taro.getStorageSync('gutsynced_user_email') || ''
    this.name = Taro.getStorageSync('gutsynced_user_name') || ''
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener())
  }

  get isAuthenticated(): boolean {
    return !!this.email && !!Taro.getStorageSync('user_token')
  }

  get userEmail(): string {
    return this.email
  }

  get userName(): string {
    return this.name
  }

  async signIn(email: string, password: string): Promise<void> {
    const result = await request({
      url: '/api/auth/login',
      method: 'POST',
      data: { email, password }
    })
    this.persist(result)
  }

  async signUp(email: string, password: string): Promise<void> {
    const result = await request({
      url: '/api/auth/register',
      method: 'POST',
      data: {
        email,
        password,
        name: email.split('@')[0] || 'GutSynced user',
        region: 'EN',
        authProvider: 'email'
      }
    })
    this.persist(result)
  }

  signOut(): void {
    this.email = ''
    this.name = ''
    Taro.removeStorageSync('user_token')
    Taro.removeStorageSync('gutsynced_user_email')
    Taro.removeStorageSync('gutsynced_user_name')
    this.notify()
  }

  private persist(result: any): void {
    if (!result?.token) {
      throw new Error(result?.error || 'Sign in failed')
    }
    Taro.setStorageSync('user_token', result.token)
    this.email = result.user?.email || ''
    this.name = result.user?.name || this.email.split('@')[0] || ''
    Taro.setStorageSync('gutsynced_user_email', this.email)
    Taro.setStorageSync('gutsynced_user_name', this.name)
    this.notify()
  }
}

export const authStore = new AuthStore()
