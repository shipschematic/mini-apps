import Taro from '@tarojs/taro'

/**
 * @deprecated This file is kept for reference only.
 * 
 * DO NOT import from this file - it causes webpack to create a common.js chunk
 * which breaks WeChat Mini Program page navigation (blank screens on redirectTo).
 * 
 * Instead, copy the request function inline into each page that needs it.
 * See any page file for the inline implementation pattern.
 * 
 * Central request helper used across the Taro frontend.
 * - Base URL defaults to the local Next.js API server (http://localhost:3000).
 * - Automatically injects JWT token stored under 'user_token' in storage.
 * - Handles JSON response parsing and HTTP errors uniformly.
 * - Throws on non‑2xx status codes so callers can catch and display a toast.
 */
export async function request({
  url,
  method = 'GET',
  data = {},
  headers = {}
}: {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  headers?: Record<string, string>
}): Promise<any> {
  const baseUrl = 'http://localhost:3001'
  const token = Taro.getStorageSync('user_token')

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  try {
    const res = await Taro.request({
      url: `${baseUrl}${url}`,
      method,
      data,
      header: finalHeaders,
    })

    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data
    }
    if (res.statusCode === 401) {
      Taro.removeStorageSync('user_token')
      Taro.redirectTo({ url: '/pages/sign-in/index' })
    }
    throw new Error(res.data?.error || `Request failed with status ${res.statusCode}`)
  } catch (err) {
    console.error('Network request error:', err)
    throw err
  }
}
