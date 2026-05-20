import { Component } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// Inline favorites helpers to avoid common.js chunk dependency in WeApp
const FAV_KEY = 'favorite_recipes'
function getFavoriteIds(): string[] { return Taro.getStorageSync(FAV_KEY) || [] }
function toggleFavorite(id: string): boolean {
  const favs = getFavoriteIds()
  const idx = favs.indexOf(id)
  const updated = idx > -1 ? favs.filter(f => f !== id) : [...favs, id]
  Taro.setStorageSync(FAV_KEY, updated)
  return idx === -1
}

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
      const favoriteIds = getFavoriteIds()
      if (favoriteIds.length === 0) {
        this.setState({ favorites: [], loading: false })
        return
      }
      const recipes = await request({ url: '/api/recipes' })
      const all = recipes || []
      const mapped = favoriteIds
        .map((id) => all.find((r: any) => r.id === id))
        .filter(Boolean)
      this.setState({ favorites: mapped, loading: false })
    } catch (err) {
      console.error('Failed to load favorites:', err)
      this.setState({ loading: false })
    }
  }

  handleRecipeClick = (id: string) => Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })

  handleToggleLike = async (id: string, e: any) => {
    e.stopPropagation()
    const wasLiked = getFavoriteIds().includes(id)
    toggleFavorite(id)
    const favoriteIds = getFavoriteIds()
    this.setState((prev: any) => ({
      favorites: prev.favorites.filter((r: any) => favoriteIds.includes(r.id))
    }))

    try {
      if (!wasLiked) {
        await request({ url: '/api/saved', method: 'POST', data: { recipeId: id } })
      } else {
        await request({ url: '/api/saved', method: 'DELETE', data: { recipeId: id } })
      }
    } catch (err) {
      console.error('Failed to update saved:', err)
    }
  }

  isFavorited = (id: string) => getFavoriteIds().includes(id)

  render() {
    const { favorites, loading } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Favorites</Text>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: '#757575', textAlign: 'center', marginTop: '24px' }}>Loading...</Text>
            ) : favorites.length === 0 ? (
              <Text style={{ fontSize: '14px', color: '#757575', textAlign: 'center', marginTop: '24px' }}>No favorite recipes yet</Text>
            ) : (
              favorites.map((recipe: any) => (
                <View key={recipe.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'row' }} onClick={() => this.handleRecipeClick(recipe.id)}>
                  <View style={{ width: '100px', height: '100px', backgroundColor: '#EEEEEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src={recipe.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
                  </View>
                  <View style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>
                    <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>{recipe.title}</Text>
                      <Text style={{ fontSize: '14px', color: this.isFavorited(recipe.id) ? '#FF4444' : '#CCCCCC' }} onClick={(e) => this.handleToggleLike(recipe.id, e)}>{this.isFavorited(recipe.id) ? '\u2764' : '\u2661'}</Text>
                    </View>
                    <Text style={{ fontSize: '14px', color: '#757575', marginTop: '4px' }}>by {recipe.authorName}</Text>
                    <Text style={{ fontSize: '12px', color: '#FF4F21', marginTop: '4px' }}>{recipe.category?.name || 'Recipe'}</Text>
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
