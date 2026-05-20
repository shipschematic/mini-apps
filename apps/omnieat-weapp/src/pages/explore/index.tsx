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

export default class Explore extends Component<{}, { selectedTab: string; favorites: string[]; categories: any[]; recipes: any[]; loading: boolean }> {
  state = { selectedTab: '', favorites: [] as string[], categories: [] as any[], recipes: [] as any[], loading: true }

  async componentDidMount() {
    this.setState({ favorites: getFavoriteIds() })
    try {
      const [cats, recs] = await Promise.all([
        request({ url: '/api/categories' }),
        request({ url: '/api/recipes' })
      ])
      const categories = cats || []
      this.setState({ categories, recipes: recs || [], selectedTab: categories[0]?.name || '', loading: false })
    } catch (err) {
      console.error('Failed to load explore data:', err)
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
    const { selectedTab, favorites, categories, recipes, loading } = this.state
    const filteredRecipes = selectedTab
      ? recipes.filter((r: any) => r.category?.name === selectedTab)
      : recipes

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: '#212121' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Explore</Text>
          <Text style={{ fontSize: '20px', color: '#212121' }}>{'\u22EE'}</Text>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          {/* Search */}
          <View style={{ padding: '12px 16px', backgroundColor: '#FFFFFF' }}>
            <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#F5F5F5', borderRadius: '12px' }}>
              <Text style={{ fontSize: '16px', color: '#757575', marginRight: '8px' }}>{'\uD83D\uDD0D'}</Text>
              <Text style={{ fontSize: '14px', color: '#999999' }}>Type for find recipes..</Text>
            </View>
          </View>

          {/* Category Tabs */}
          <View style={{ padding: '8px 16px 16px', backgroundColor: '#FFFFFF' }}>
            <ScrollView scrollX showScrollbar={false}>
              <View style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                {categories.map((cat: any) => (
                  <View key={cat.id} onClick={() => this.setState({ selectedTab: cat.name })} style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: selectedTab === cat.name ? '#FF5722' : '#F5F5F5' }}>
                    <Text style={{ fontSize: '14px', fontWeight: selectedTab === cat.name ? '600' : '400', color: selectedTab === cat.name ? '#FFFFFF' : '#212121' }}>{cat.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Promo Banner */}
          <View style={{ margin: '16px', position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '160px' }}>
            <Image src='https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=300&fit=crop' mode='aspectFill' style={{ width: '100%', height: '100%' }} />
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Text style={{ fontSize: '18px', fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>Exclusive Recipes</Text>
              <Text style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '12px' }}>Await in Dapoer+</Text>
              <View style={{ backgroundColor: '#FFFFFF', padding: '8px 16px', borderRadius: '20px', alignSelf: 'flex-start' }}>
                <Text style={{ fontSize: '13px', fontWeight: '600', color: '#212121' }}>Start 7-day FREE Trial</Text>
              </View>
            </View>
          </View>

          {/* Recipe Grid */}
          <View style={{ padding: '0 16px 16px' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: '#999999', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                {filteredRecipes.map((recipe: any) => (
                  <View key={recipe.id} style={{ width: 'calc(50% - 6px)', backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden' }} onClick={() => this.handleRecipeClick(recipe.id)}>
                    <View style={{ position: 'relative', height: '160px' }}>
                      <Image src={recipe.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
                      <View style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => this.handleToggleLike(recipe.id, e)}>
                        <Text style={{ fontSize: '12px', color: favorites.includes(recipe.id) ? '#FF4444' : '#999999' }}>{'\u2764'}</Text>
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
