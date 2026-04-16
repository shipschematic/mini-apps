import api from './api'

export interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export const authService = {
  async wechatLogin(code: string): Promise<LoginResponse> {
    const response = await api.post('/auth/wechat/login', { code })
    return response.data
  },

  async adminLogin(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/admin/login', { username, password })
    return response.data
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh')
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },
}
