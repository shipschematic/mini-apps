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

interface ProfileState {
  activeTab: 'recipes' | 'livestream'
  userInfo: any
  recipes: any[]
  stats: any
  loading: boolean
}

export default class Profile extends Component<{}, ProfileState> {
  state: ProfileState = {
    activeTab: 'recipes',
    userInfo: null,
    recipes: [],
    stats: { recipes: 0, followers: 0, following: 0 },
    loading: true
  }

  async componentDidShow() {
    const userInfo = Taro.getStorageSync('user_info')
    if (userInfo) {
      this.setState({ userInfo })
      try {
        const [recipes, user] = await Promise.all([
          request({ url: '/api/users/recipes' }),
          request({ url: `/api/users/${userInfo.id}` })
        ])
        this.setState({
          recipes: recipes || [],
          stats: user?._count || { recipes: 0, followers: 0, following: 0 },
          loading: false
        })
      } catch (err) {
        console.error('Failed to load profile:', err)
        this.setState({ loading: false })
      }
    } else {
      this.setState({ loading: false })
    }
  }

  handleEditProfile = () => Taro.navigateTo({ url: '/pages/edit-profile/index' })
  handleSettings = () => Taro.navigateTo({ url: '/pages/settings/index' })
  handleRecipeClick = (id: string) => Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })
  handleTabChange = (tab: 'recipes' | 'livestream') => {
    if (tab === 'livestream') Taro.navigateTo({ url: '/pages/profile-livestream/index' })
    else this.setState({ activeTab: 'recipes' })
  }

  render() {
    const { activeTab, userInfo, recipes, stats, loading } = this.state
    const displayName = userInfo?.name || 'Chef Guest'
    const handleName = userInfo?.email ? `@${userInfo.email.split('@')[0]}` : '@chef_guest'

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F7F7F7' }}>
        {/* Navbar */}
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF4F21' }}>Dapoer</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Profile</Text>
          <Text style={{ fontSize: '20px', color: '#999999' }} onClick={this.handleSettings}>:</Text>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          {/* Header */}
          <View style={{ alignItems: 'center', padding: '24px', backgroundColor: '#FFFFFF', marginBottom: '8px' }}>
            <View style={{ width: '80px', height: '80px', borderRadius: '40px', backgroundColor: '#FF4F21', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Text style={{ fontSize: '32px', color: '#FFFFFF' }}>{displayName[0]}</Text>
            </View>
            <Text style={{ fontSize: '20px', fontWeight: '600', color: '#212121' }}>{displayName}</Text>
            <Text style={{ fontSize: '14px', color: '#757575', marginTop: '4px' }}>{handleName}</Text>

            <View style={{ display: 'flex', flexDirection: 'row', marginTop: '16px', gap: '32px' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: '18px', fontWeight: '600', color: '#212121' }}>{stats.recipes}</Text>
                <Text style={{ fontSize: '12px', color: '#757575' }}>Recipes</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: '18px', fontWeight: '600', color: '#212121' }}>{stats.followers}</Text>
                <Text style={{ fontSize: '12px', color: '#757575' }}>Followers</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: '18px', fontWeight: '600', color: '#212121' }}>{stats.following}</Text>
                <Text style={{ fontSize: '12px', color: '#757575' }}>Following</Text>
              </View>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', marginTop: '16px', gap: '8px' }}>
              <View style={{ backgroundColor: '#FF4F21', borderRadius: '8px', padding: '8px 20px' }} onClick={this.handleEditProfile}>
                <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '14px' }}>Edit Profile</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE' }}>
            <View style={{ flex: 1, alignItems: 'center', padding: '12px', borderBottom: activeTab === 'recipes' ? '2px solid #FF4F21' : '2px solid transparent' }} onClick={() => this.handleTabChange('recipes')}>
              <Text style={{ fontSize: '14px', fontWeight: activeTab === 'recipes' ? '600' : '400', color: activeTab === 'recipes' ? '#FF4F21' : '#757575' }}>My Recipes</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', padding: '12px', borderBottom: activeTab === 'livestream' ? '2px solid #FF4F21' : '2px solid transparent' }} onClick={() => this.handleTabChange('livestream')}>
              <Text style={{ fontSize: '14px', fontWeight: activeTab === 'livestream' ? '600' : '400', color: activeTab === 'livestream' ? '#FF4F21' : '#757575' }}>Livestreams</Text>
            </View>
          </View>

          {/* Recipes Grid */}
          <View style={{ padding: '12px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
            {loading ? (
              <Text style={{ fontSize: '14px', color: '#999999', textAlign: 'center', width: '100%', padding: '20px' }}>Loading...</Text>
            ) : recipes.length === 0 ? (
              <Text style={{ fontSize: '14px', color: '#757575', textAlign: 'center', width: '100%', padding: '20px' }}>No recipes yet</Text>
            ) : (
              recipes.map((recipe: any) => (
                <View key={recipe.id} style={{ width: 'calc(50% - 6px)', backgroundColor: '#FFFFFF', borderRadius: '12px', overflow: 'hidden' }} onClick={() => this.handleRecipeClick(recipe.id)}>
                  <View style={{ height: '120px', backgroundColor: '#EEEEEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src={recipe.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
                  </View>
                  <View style={{ padding: '10px' }}>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>{recipe.title}</Text>
                    <Text style={{ fontSize: '12px', color: '#757575', marginTop: '4px' }}>by {recipe.authorName}</Text>
                    <Text style={{ fontSize: '11px', color: '#999999', marginTop: '4px' }}>{recipe.estimatedTime} | {recipe.quantity}</Text>
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
