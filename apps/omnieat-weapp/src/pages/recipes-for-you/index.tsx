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

export default class RecipesForYou extends Component<{}, { favorites: string[]; recipes: any[]; loading: boolean }> {
  state = { favorites: [] as string[], recipes: [] as any[], loading: true }

  async componentDidMount() {
    this.setState({ favorites: getFavoriteIds() })
    try {
      const recs = await request({ url: '/api/recipes' })
      this.setState({ recipes: recs || [], loading: false })
    } catch (err) {
      console.error('Failed to load recipes:', err)
      this.setState({ loading: false })
    }
  }

  onShow = () => {
    this.setState({ favorites: getFavoriteIds() })
  }

  handleRecipeClick = (id: string) => Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })

  handleToggleLike = (id: string, e: any) => {
    e.stopPropagation()
    toggleFavorite(id)
    this.setState({ favorites: getFavoriteIds() })
  }

  render() {
    const { favorites, recipes, loading } = this.state
    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Recipes For You</Text>
          <View style={{ width: '24px' }} />
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: '#999999', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                {recipes.map((recipe: any) => (
                  <View key={recipe.id} style={{ width: 'calc(50% - 6px)', backgroundColor: '#FFFFFF', borderRadius: '12px', overflow: 'hidden' }} onClick={() => this.handleRecipeClick(recipe.id)}>
                    <View style={{ position: 'relative', height: '120px' }}>
                      <Image src={recipe.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
                      <View style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => this.handleToggleLike(recipe.id, e)}>
                        <Text style={{ fontSize: '12px', color: favorites.includes(recipe.id) ? '#FF4444' : '#999999' }}>{'\u2764'}</Text>
                      </View>
                    </View>
                    <View style={{ padding: '10px' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>{recipe.title}</Text>
                      <Text style={{ fontSize: '12px', color: '#757575', marginTop: '4px' }}>by {recipe.authorName}</Text>
                      <Text style={{ fontSize: '11px', color: '#999999', marginTop: '4px' }}>{recipe.estimatedTime} | {recipe.quantity}</Text>
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
