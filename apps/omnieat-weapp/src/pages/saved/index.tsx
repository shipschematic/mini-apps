import { Component } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'

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

export default class Saved extends Component<{}, { recipes: any[]; loading: boolean }> {
  state = { recipes: [] as any[], loading: true }

  async componentDidMount() {
    await this.loadSaved()
  }

  onShow = () => {
    this.loadSaved()
  }

  loadSaved = async () => {
    try {
      const saved = await request({ url: '/api/saved' })
      const mapped = (saved || []).map((s: any) => s.recipe).filter(Boolean)
      this.setState({ recipes: mapped, loading: false })
    } catch (err) {
      console.error('Failed to load saved recipes:', err)
      this.setState({ loading: false })
    }
  }

  handleRecipeClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })
  }

  handleBack = () => {
    const pages = Taro.getCurrentPages()
    if (pages.length > 1) {
      Taro.navigateBack()
    } else {
      Taro.switchTab({ url: '/pages/home/index' })
    }
  }

  handleToggleLike = async (id: string, e: any) => {
    e.stopPropagation()
    toggleFavorite(id)
    try {
      await request({ url: '/api/saved', method: 'DELETE', data: { recipeId: id } })
      const saved = await request({ url: '/api/saved' })
      const mapped = (saved || []).map((s: any) => s.recipe).filter(Boolean)
      this.setState({ recipes: mapped })
    } catch (err) {
      console.error('Failed to update saved:', err)
    }
  }

  isFavorited = (id: string) => getFavoriteIds().includes(id)

  render() {
    const { recipes, loading } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={this.handleBack}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Saved</Text>
          <Text style={{ fontSize: '20px', color: '#212121' }}>{'\u22EE'}</Text>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: '#757575', textAlign: 'center', marginTop: '24px' }}>Loading...</Text>
            ) : recipes.length === 0 ? (
              <Text style={{ fontSize: '14px', color: '#757575', textAlign: 'center', marginTop: '24px' }}>No saved recipes yet</Text>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                {recipes.map((recipe) => (
                  <View key={recipe.id} style={{ width: 'calc(50% - 6px)', backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden' }} onClick={() => this.handleRecipeClick(recipe.id)}>
                    <View style={{ position: 'relative', height: '160px' }}>
                      <Image src={recipe.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
                      <View style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => this.handleToggleLike(recipe.id, e)}>
                        <Text style={{ fontSize: '12px', color: this.isFavorited(recipe.id) ? '#FF4444' : '#CCCCCC' }}>{this.isFavorited(recipe.id) ? '\u2764' : '\u2661'}</Text>
                      </View>
                    </View>
                    <View style={{ padding: '10px 4px' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>{recipe.title}</Text>
                      <Text style={{ fontSize: '12px', color: '#757575', marginTop: '4px' }}>By {recipe.authorName}</Text>
                      <View style={{ display: 'flex', alignItems: 'center', marginTop: '6px' }}>
                        <Text style={{ fontSize: '11px', color: '#FF9800' }}>{'\u2605'} {recipe.rating || 0}</Text>
                        <Text style={{ fontSize: '11px', color: '#999999', marginLeft: '8px' }}>{recipe.estimatedTime}</Text>
                      </View>
                    </View>
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
