import { Component } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

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

export default class MyRecipes extends Component<{}, { activeTab: 'recipes' | 'drafts'; recipes: any[]; drafts: any[]; loading: boolean }> {
  state = { activeTab: 'recipes' as const, recipes: [] as any[], drafts: [] as any[], loading: true }

  async componentDidMount() {
    try {
      const [published, draftList] = await Promise.all([
        request({ url: '/api/users/recipes?status=PUBLISHED' }),
        request({ url: '/api/users/recipes?status=DRAFT' })
      ])
      this.setState({ recipes: published || [], drafts: draftList || [], loading: false })
    } catch (err) {
      console.error('Failed to load my recipes:', err)
      this.setState({ loading: false })
    }
  }

  handleRecipeClick = (id: string) => Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })

  render() {
    const { activeTab, recipes, drafts, loading } = this.state
    const list = activeTab === 'recipes' ? recipes : drafts

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>My Recipes</Text>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE' }}>
          <View style={{ flex: 1, alignItems: 'center', padding: '12px', borderBottom: activeTab === 'recipes' ? '2px solid #FF4F21' : '2px solid transparent' }} onClick={() => this.setState({ activeTab: 'recipes' })}>
            <Text style={{ fontSize: '14px', fontWeight: activeTab === 'recipes' ? '600' : '400', color: activeTab === 'recipes' ? '#FF4F21' : '#757575' }}>My Recipes</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', padding: '12px', borderBottom: activeTab === 'drafts' ? '2px solid #FF4F21' : '2px solid transparent' }} onClick={() => this.setState({ activeTab: 'drafts' })}>
            <Text style={{ fontSize: '14px', fontWeight: activeTab === 'drafts' ? '600' : '400', color: activeTab === 'drafts' ? '#FF4F21' : '#757575' }}>Drafts</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: '#999999', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : list.length === 0 ? (
              <View style={{ alignItems: 'center', padding: '40px' }}>
                <Text style={{ fontSize: '16px', color: '#757575' }}>No {activeTab} yet</Text>
              </View>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                {list.map((recipe: any) => (
                  <View key={recipe.id} style={{ width: 'calc(50% - 6px)', backgroundColor: '#FFFFFF', borderRadius: '12px', overflow: 'hidden' }} onClick={() => this.handleRecipeClick(recipe.id)}>
                    <View style={{ height: '120px', backgroundColor: '#EEEEEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image src={recipe.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View style={{ padding: '10px' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>{recipe.title}</Text>
                      <Text style={{ fontSize: '12px', color: '#757575', marginTop: '4px' }}>by {recipe.authorName}</Text>
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
