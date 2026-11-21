import { Component } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

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

export default class Favorite extends Component<{}, { favorites: any[]; loading: boolean }> {
  state = { favorites: [] as any[], loading: true }

  async componentDidMount() {
    await this.loadFavorites()
  }

  onShow = () => {
    this.loadFavorites()
  }

  loadFavorites = async () => {
    this.setState({ loading: true })
    try {
      const saved = await request({ url: '/api/saved' })
      this.setState({ favorites: saved || [], loading: false })
    } catch (err) {
      console.error('Failed to load favorites:', err)
      this.setState({ favorites: [], loading: false })
    }
  }

  handleRecipeClick = (id: string) => Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })

  handleToggleLike = async (id: string, e: any) => {
    e.stopPropagation()
    const { favorites } = this.state
    const wasLiked = favorites.some((f: any) => f.recipeId === id)

    this.setState({ favorites: favorites.filter((f: any) => f.recipeId !== id) })

    try {
      await request({ url: '/api/saved', method: 'DELETE', data: { recipeId: id } })
    } catch (err) {
      console.error('Failed to update saved:', err)
      this.setState({ favorites })
    }
  }

  render() {
    const { favorites, loading } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Favorites</Text>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', marginTop: '24px' }}>Loading...</Text>
            ) : favorites.length === 0 ? (
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', marginTop: '24px' }}>No favorite recipes yet</Text>
            ) : (
              favorites.map((item: any) => (
                <View key={item.recipe?.id || item.recipeId} style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'row' }} onClick={() => this.handleRecipeClick(item.recipe?.id || item.recipeId)}>
                  <View style={{ width: '100px', height: '100px', backgroundColor: 'var(--color-outline)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src={item.recipe?.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
                  </View>
                  <View style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>
                    <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>{item.recipe?.title}</Text>
                      <Text style={{ fontSize: '14px', color: '#EF4444' }} onClick={(e) => this.handleToggleLike(item.recipe?.id || item.recipeId, e)}>{'\u2764'}</Text>
                    </View>
                    <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>by {item.recipe?.authorName || 'Unknown'}</Text>
                    <Text style={{ fontSize: '12px', color: 'var(--color-primary)', marginTop: '4px' }}>{item.recipe?.category?.name || 'Recipe'}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}
