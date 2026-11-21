import { Component } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
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

interface ProfileUserState {
  userId: string
  loading: boolean
  user: any
  isFollowing: boolean
  activeTab: 'recipes' | 'about'
}

export default class ProfileUser extends Component<{}, ProfileUserState> {
  state: ProfileUserState = {
    userId: '',
    loading: true,
    user: null,
    isFollowing: false,
    activeTab: 'recipes'
  }

  async componentDidMount() {
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    const userId = currentPage.options?.id

    if (userId) {
      this.setState({ userId })
      await this.loadUserProfile(userId)
    } else {
      Taro.showToast({ title: 'User ID required', icon: 'none' })
      Taro.navigateBack()
    }
  }

  loadUserProfile = async (userId: string) => {
    try {
      const user = await request({ url: `/api/users/${userId}` })
      const followStatus = await request({ url: `/api/users/${userId}/follow` })
      this.setState({ user, isFollowing: followStatus?.following || false, loading: false })
    } catch (err) {
      console.error('Failed to load user profile:', err)
      this.setState({ loading: false })
    }
  }

  handleFollow = async () => {
    const { userId, isFollowing } = this.state
    try {
      if (isFollowing) {
        await request({ url: `/api/users/${userId}/follow`, method: 'DELETE' })
      } else {
        await request({ url: `/api/users/${userId}/follow`, method: 'POST' })
      }
      this.setState(prev => ({ isFollowing: !prev.isFollowing }))
      Taro.showToast({ title: isFollowing ? 'Unfollowed' : 'Following!', icon: 'success' })
    } catch (err) {
      console.error('Failed to follow:', err)
      Taro.showToast({ title: 'Failed', icon: 'none' })
    }
  }

  handleRecipeClick = (recipe: any) => {
    Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${recipe.id}` })
  }

  handleTabChange = (tab: 'recipes' | 'about') => {
    this.setState({ activeTab: tab })
  }

  render() {
    const { user, loading, isFollowing, activeTab } = this.state

    if (loading) {
      return (
        <View style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
          <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)' }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Profile</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Text>Loading profile...</Text>
          </View>
        </View>
      )
    }

    if (!user) {
      return (
        <View style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
          <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)' }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Profile</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Text>User not found</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Profile</Text>
        </View>

        <ScrollView scrollY style={{ height: 'calc(100vh - 50px)' }}>
          <View style={{ padding: '24px 16px', alignItems: 'center', backgroundColor: 'var(--color-surface)', marginBottom: '8px' }}>
            <Image
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'}
              mode='aspectFill'
              style={{ width: '80px', height: '80px', borderRadius: '40px', marginBottom: '12px' }}
            />
            <Text style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>{user.name}</Text>
            {user.bio && (
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center' }}>{user.bio}</Text>
            )}
          </View>

          <View style={{ display: 'flex', justifyContent: 'space-around', padding: '16px', backgroundColor: 'var(--color-surface)', marginBottom: '8px' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{user._count?.recipes || 0}</Text>
              <Text style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Recipes</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{user._count?.followers || 0}</Text>
              <Text style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Followers</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{user._count?.following || 0}</Text>
              <Text style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Following</Text>
            </View>
          </View>

          <View style={{ padding: '16px', backgroundColor: 'var(--color-surface)', marginBottom: '8px' }}>
            <View
              onClick={this.handleFollow}
              style={{
                backgroundColor: isFollowing ? 'var(--color-surface)' : 'var(--color-primary-container)',
                padding: '12px',
                borderRadius: '8px',
                alignItems: 'center',
                border: isFollowing ? '1px solid var(--color-outline)' : 'none'
              }}
            >
              <Text style={{ color: isFollowing ? '#333' : '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </View>
          </View>

          <View style={{ display: 'flex', backgroundColor: 'var(--color-surface)', marginBottom: '8px' }}>
            <View
              onClick={() => this.handleTabChange('recipes')}
              style={{
                flex: 1,
                padding: '16px',
                alignItems: 'center',
                borderBottom: activeTab === 'recipes' ? '2px solid var(--color-primary)' : '2px solid transparent'
              }}
            >
              <Text style={{ fontSize: '14px', fontWeight: activeTab === 'recipes' ? 'bold' : 'normal', color: activeTab === 'recipes' ? 'var(--color-primary)' : 'var(--color-muted)' }}>
                Recipes
              </Text>
            </View>
            <View
              onClick={() => this.handleTabChange('about')}
              style={{
                flex: 1,
                padding: '16px',
                alignItems: 'center',
                borderBottom: activeTab === 'about' ? '2px solid var(--color-primary)' : '2px solid transparent'
              }}
            >
              <Text style={{ fontSize: '14px', fontWeight: activeTab === 'about' ? 'bold' : 'normal', color: activeTab === 'about' ? 'var(--color-primary)' : 'var(--color-muted)' }}>
                About
              </Text>
            </View>
          </View>

          {activeTab === 'recipes' ? (
            <View style={{ padding: '16px' }}>
              {(user.recipes || []).length === 0 ? (
                <View style={{ alignItems: 'center', padding: '40px' }}>
                  <Text style={{ fontSize: '32px', marginBottom: '12px' }}>&#127859;</Text>
                  <Text style={{ fontSize: '14px', color: '#999' }}>No recipes yet</Text>
                </View>
              ) : (
                <View>
                  {user.recipes.map((recipe: any) => (
                    <View
                      key={recipe.id}
                      onClick={() => this.handleRecipeClick(recipe)}
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '12px'
                      }}
                    >
                      <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{recipe.title}</Text>
                      <Text style={{ fontSize: '12px', color: '#999' }}>{recipe.estimatedTime || ''} &#9733; {recipe.rating || 0}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={{ padding: '16px', backgroundColor: 'var(--color-surface)' }}>
              <View style={{ marginBottom: '16px' }}>
                <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '4px' }}>Member Since</Text>
                <Text style={{ fontSize: '16px' }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Unknown'}
                </Text>
              </View>
              {user.bio && (
                <View>
                  <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '4px' }}>Bio</Text>
                  <Text style={{ fontSize: '16px' }}>{user.bio}</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    )
  }
}
