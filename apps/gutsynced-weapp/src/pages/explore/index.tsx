import { Component } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'

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

async function loadFavoritedIds(): Promise<string[]> {
  try {
    return await request({ url: '/api/saved?ids=true' }) || []
  } catch {
    return []
  }
}

export default class Explore extends Component<{}, { selectedTab: string; favoritedIds: string[]; categories: any[]; recipes: any[]; loading: boolean }> {
  state = { selectedTab: '', favoritedIds: [] as string[], categories: [] as any[], recipes: [] as any[], loading: true }

  async componentDidMount() {
    try {
      const [favIds, cats, recs] = await Promise.all([
        loadFavoritedIds(),
        request({ url: '/api/categories' }),
        request({ url: '/api/recipes' })
      ])
      const categories = cats || []
      this.setState({ favoritedIds: favIds, categories, recipes: recs || [], selectedTab: categories[0]?.name || '', loading: false })
    } catch (err) {
      console.error('Failed to load explore data:', err)
      this.setState({ loading: false })
    }
  }

  onShow = () => {
    loadFavoritedIds().then(ids => this.setState({ favoritedIds: ids }))
  }

  handleRecipeClick = (id: string) => Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })

  handleToggleLike = async (id: string, e: any) => {
    e.stopPropagation()
    const { favoritedIds } = this.state
    const wasLiked = favoritedIds.includes(id)
    const newIds = wasLiked ? favoritedIds.filter((fid: string) => fid !== id) : [...favoritedIds, id]
    this.setState({ favoritedIds: newIds })

    try {
      if (!wasLiked) {
        await request({ url: '/api/saved', method: 'POST', data: { recipeId: id } })
      } else {
        await request({ url: '/api/saved', method: 'DELETE', data: { recipeId: id } })
      }
    } catch (err) {
      console.error('Failed to update saved:', err)
      this.setState({ favoritedIds })
    }
  }

  render() {
    const { selectedTab, favoritedIds, categories, recipes, loading } = this.state
    const filteredRecipes = selectedTab
      ? recipes.filter((r: any) => r.category?.name === selectedTab)
      : recipes

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Explore</Text>
          <Text style={{ fontSize: '20px', color: 'var(--color-text)' }}>{'\u22EE'}</Text>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          {/* Search */}
          <View style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface)' }}>
            <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--color-background)', borderRadius: '12px' }}>
              <Text style={{ fontSize: '16px', color: 'var(--color-muted)', marginRight: '8px' }}>{'\uD83D\uDD0D'}</Text>
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Type for find recipes..</Text>
            </View>
          </View>

          {/* Category Tabs */}
          <View style={{ padding: '8px 16px 16px', backgroundColor: 'var(--color-surface)' }}>
            <ScrollView scrollX showScrollbar={false}>
              <View style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                {categories.map((cat: any) => (
                  <View key={cat.id} onClick={() => this.setState({ selectedTab: cat.name })} style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: selectedTab === cat.name ? 'var(--color-primary-container)' : 'var(--color-background)' }}>
                    <Text style={{ fontSize: '14px', fontWeight: selectedTab === cat.name ? '600' : '400', color: selectedTab === cat.name ? '#FFFFFF' : 'var(--color-text)' }}>{cat.name}</Text>
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
              <Text style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '12px' }}>Await in GutSynced+</Text>
              <View style={{ backgroundColor: 'var(--color-surface)', padding: '8px 16px', borderRadius: '20px', alignSelf: 'flex-start' }}>
                <Text style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>Start 7-day FREE Trial</Text>
              </View>
            </View>
          </View>

          {/* Recipe Grid */}
          <View style={{ padding: '0 16px 16px' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                {filteredRecipes.map((recipe: any) => (
                  <View key={recipe.id} style={{ width: 'calc(50% - 6px)', backgroundColor: 'var(--color-surface)', borderRadius: '16px', overflow: 'hidden' }} onClick={() => this.handleRecipeClick(recipe.id)}>
                    <View style={{ position: 'relative', height: '160px' }}>
                      <Image src={recipe.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
                      <View style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => this.handleToggleLike(recipe.id, e)}>
                        <Text style={{ fontSize: '12px', color: favoritedIds.includes(recipe.id) ? 'var(--color-danger)' : 'var(--color-muted)' }}>{'\u2764'}</Text>
                      </View>
                    </View>
                    <View style={{ padding: '10px 4px' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>{recipe.title}</Text>
                      <Text style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>By {recipe.authorName}</Text>
                      <View style={{ display: 'flex', alignItems: 'center', marginTop: '6px' }}>
                        <Text style={{ fontSize: '11px', color: '#FBBF24' }}>{'\u2605'} {recipe.rating || 0}</Text>
                        <Text style={{ fontSize: '11px', color: 'var(--color-muted)', marginLeft: '8px' }}>{recipe.estimatedTime}</Text>
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
