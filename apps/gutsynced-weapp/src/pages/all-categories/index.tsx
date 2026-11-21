import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'

// Inline request function to avoid common.js chunk dependency in WeApp
async function request({
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

export default class AllCategories extends Component<{}, { categories: any[]; loading: boolean }> {
  state = { categories: [] as any[], loading: true }

  async componentDidMount() {
    try {
      const cats = await request({ url: '/api/categories' })
      this.setState({ categories: cats || [], loading: false })
    } catch (err) {
      console.error('Failed to load categories:', err)
      this.setState({ loading: false })
    }
  }

  handleCategoryClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/categories/index?category=${id}` })
  }

  render() {
    const { categories, loading } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-surface)' }}>
        {/* Header */}
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>All Categories</Text>
          <Text style={{ fontSize: '20px', color: 'var(--color-text)' }}>{'\u22EE'}</Text>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '24px 16px' }}>
            <Text style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '24px' }}>All Categories</Text>
            {loading ? (
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px' }}>
                {categories.map((cat: any) => (
                  <View key={cat.id} style={{ width: 'calc(25% - 12px)', alignItems: 'center' }} onClick={() => this.handleCategoryClick(cat.id)}>
                    <View style={{ width: '64px', height: '64px', borderRadius: '32px', backgroundColor: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                      <Text style={{ fontSize: '28px' }}>{cat.icon}</Text>
                    </View>
                    <Text style={{ fontSize: '12px', color: 'var(--color-text)', textAlign: 'center' }}>{cat.name}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}
