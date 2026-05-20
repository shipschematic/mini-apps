import { Component } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { favoriteStore } from '../../utils/favoriteStore'
import { recipeStore } from '../../utils/recipeStore'
import { categoryStore } from '../../utils/categoryStore'
import { request } from '../../utils/request'

export default class Home extends Component<{}, { displayName: string; favoritedIds: string[]; categories: any[]; recipes: any[]; liveStreams: any[]; loading: boolean; error: string }> {
  state = { displayName: 'Guest', favoritedIds: favoriteStore.getIds(), categories: [] as any[], recipes: [] as any[], liveStreams: [] as any[], loading: true, error: '' }
  private unsubscribe?: () => void

  async componentDidMount() {
    console.log('[HOME] componentDidMount')
    
    // Subscribe to favorite store updates
    this.unsubscribe = favoriteStore.subscribe((ids) => {
      console.log('[HOME] Store notification:', ids.length, 'favorites')
      this.setState({ favoritedIds: ids })
    })

    const userInfo = Taro.getStorageSync('user_info')
    if (userInfo?.name) {
      this.setState({ displayName: userInfo.name })
    }

    try {
      // Use centralized stores for recipes and categories
      const [cats, recs, lives] = await Promise.all([
        categoryStore.getAll(),
        recipeStore.getAll(),
        request({ url: '/api/livestreams' })
      ])
      
      // Get fresh favorites from server
      await favoriteStore.getFresh(true)
      
      this.setState({ 
        categories: cats || [], 
        recipes: recs || [], 
        liveStreams: lives || [], 
        loading: false, 
        error: '' 
      })
    } catch (err: any) {
      this.setState({ loading: false, error: err.message || 'Failed to load data' })
    }
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  handleToggleLike = async (id: string, e: any) => {
    e.stopPropagation()
    try {
      await favoriteStore.toggle(id)
    } catch (err: any) {
      Taro.showToast({ title: 'Failed to update', icon: 'none' })
    }
  }

  handleRecipeClick = (id: string) => Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${id}` })
  handleCategoryClick = (id: string) => Taro.navigateTo({ url: `/pages/categories/index?category=${id}` })
  handleSearchClick = () => Taro.switchTab({ url: '/pages/search/index' })
  handleNotificationClick = () => Taro.navigateTo({ url: '/pages/notifications/index' })
  handleSeeAllCategories = () => Taro.navigateTo({ url: '/pages/all-categories/index' })
  handleSeeAllRecipes = () => Taro.navigateTo({ url: '/pages/recipes-for-you/index' })
  handleLiveClick = () => Taro.navigateTo({ url: '/pages/live-cooking/index' })

  render() {
    const { displayName, favoritedIds, categories, recipes, liveStreams, loading, error } = this.state

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <View style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' mode='aspectFill' style={{ width: '44px', height: '44px', borderRadius: '22px' }} />
            <View>
              <Text style={{ fontSize: '12px', color: '#757575' }}>Hi, {displayName}</Text>
              <Text style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>Start your schedule! {'\uD83D\uDC4B'}</Text>
            </View>
          </View>
          <View onClick={this.handleNotificationClick} style={{ position: 'relative' }}>
            <Text style={{ fontSize: '22px' }}>{'\uD83D\uDD14'}</Text>
            <View style={{ position: 'absolute', top: '0px', right: '0px', width: '8px', height: '8px', borderRadius: '4px', backgroundColor: '#FF5722' }} />
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          {/* Search */}
          <View onClick={this.handleSearchClick} style={{ margin: '0 16px 20px', display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#F5F5F5', borderRadius: '12px' }}>
            <Text style={{ fontSize: '16px', color: '#757575', marginRight: '8px' }}>{'\uD83D\uDD0D'}</Text>
            <Text style={{ fontSize: '14px', color: '#999999' }}>Type for find recipes..</Text>
          </View>

          {/* Live Streaming */}
          {liveStreams.length > 0 && (
            <View style={{ marginBottom: '24px' }}>
              <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: '12px' }}>
                <Text style={{ fontSize: '18px', fontWeight: '600', color: '#212121' }}>Live Streaming</Text>
                <View style={{ display: 'flex', gap: '4px' }}>
                  <View style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#FF5722' }} />
                  <View style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: '#E0E0E0' }} />
                  <View style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: '#E0E0E0' }} />
                </View>
              </View>
              <ScrollView scrollX showScrollbar={false} style={{ paddingLeft: '16px' }}>
                <View style={{ display: 'flex', flexDirection: 'row', gap: '12px', paddingRight: '16px' }}>
                  {liveStreams.map((live: any) => (
                    <View key={live.id} onClick={this.handleLiveClick} style={{ position: 'relative', width: '280px', height: '160px', borderRadius: '16px', overflow: 'hidden' }}>
                      <Image src={live.imageUrl || 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=400&h=250&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
                      <View style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '12px' }}>
                        <View style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: '#FF4444', marginRight: '4px' }} />
                        <Text style={{ fontSize: '11px', fontWeight: '600', color: '#212121' }}>{live.status === 'LIVE' ? 'Live Now' : 'Upcoming'}</Text>
                      </View>
                      <View style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '12px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                        <View style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Image src={live.hostAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'} mode='aspectFill' style={{ width: '28px', height: '28px', borderRadius: '14px' }} />
                          <View>
                            <Text style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>{live.hostName}</Text>
                            <Text style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>{live.title}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Categories */}
          <View style={{ marginBottom: '24px' }}>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: '12px' }}>
              <Text style={{ fontSize: '18px', fontWeight: '600', color: '#212121' }}>Categories</Text>
              <Text onClick={this.handleSeeAllCategories} style={{ fontSize: '14px', color: '#FF5722' }}>See all</Text>
            </View>
            <ScrollView scrollX showScrollbar={false} style={{ paddingLeft: '16px' }}>
              <View style={{ display: 'flex', flexDirection: 'row', gap: '16px', paddingRight: '16px' }}>
                {categories.map((cat: any) => (
                  <View key={cat.id} onClick={() => this.handleCategoryClick(cat.id)} style={{ alignItems: 'center' }}>
                    <View style={{ width: '64px', height: '64px', borderRadius: '32px', backgroundColor: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                      <Text style={{ fontSize: '28px' }}>{cat.icon}</Text>
                    </View>
                    <Text style={{ fontSize: '12px', color: '#212121' }}>{cat.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Recipes For You */}
          <View style={{ padding: '0 16px', marginBottom: '24px' }}>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <Text style={{ fontSize: '18px', fontWeight: '600', color: '#212121' }}>Recipes For You</Text>
              <Text onClick={this.handleSeeAllRecipes} style={{ fontSize: '14px', color: '#FF5722' }}>See all</Text>
            </View>
            {loading ? (
              <Text style={{ fontSize: '14px', color: '#999999', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : error ? (
              <Text style={{ fontSize: '14px', color: '#FF4444', textAlign: 'center', padding: '20px' }}>{error}</Text>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                {recipes.slice(0, 4).map((recipe: any) => (
                  <View key={recipe.id} onClick={() => this.handleRecipeClick(recipe.id)} style={{ width: 'calc(50% - 6px)', backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden' }}>
                    <View style={{ position: 'relative', height: '160px' }}>
                      <Image src={recipe.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
                      <View style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => this.handleToggleLike(recipe.id, e)}>
                        <Text style={{ fontSize: '14px', color: favoritedIds.includes(recipe.id) ? '#FF4444' : '#999999' }}>{'\u2764'}</Text>
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
