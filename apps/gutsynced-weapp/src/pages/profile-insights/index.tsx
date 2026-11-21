import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface InsightsState {
  loading: boolean
  stats: {
    totalRecipes: number
    totalViews: number
    totalLikes: number
    totalFollowers: number
    trendingRecipes: any[]
    recentActivity: any[]
  }
}

export default class ProfileInsights extends Component<{}, InsightsState> {
  state: InsightsState = {
    loading: true,
    stats: {
      totalRecipes: 0,
      totalViews: 0,
      totalLikes: 0,
      totalFollowers: 0,
      trendingRecipes: [],
      recentActivity: []
    }
  }

  componentDidMount = async () => {
    await this.loadInsights()
  }

  loadInsights = async () => {
    try {
      Taro.showLoading({ title: 'Loading...' })
      await new Promise(resolve => setTimeout(resolve, 500))
      this.setState({
        stats: {
          totalRecipes: 12,
          totalViews: 3456,
          totalLikes: 892,
          totalFollowers: 234,
          trendingRecipes: [
            { id: '1', title: 'Pasta Carbonara', views: 1200, likes: 340 },
            { id: '2', title: 'Thai Green Curry', views: 980, likes: 275 },
            { id: '3', title: 'Sourdough Bread', views: 850, likes: 210 }
          ],
          recentActivity: []
        },
        loading: false
      })
      Taro.hideLoading()
    } catch (error: any) {
      Taro.hideLoading()
      Taro.showToast({ title: 'Failed to load insights', icon: 'none' })
      this.setState({ loading: false })
    }
  }

  render() {
    const { loading, stats } = this.state

    return (
      <View style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Insights</Text>
        </View>

        <ScrollView scrollY style={{ height: 'calc(100vh - 50px)' }}>
          <View style={{ margin: '16px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Overview</Text>
            <View style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <View style={{ width: 'calc(50% - 6px)', backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '16px', alignItems: 'center' }}>
                <View style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <Text style={{ fontSize: '18px' }}>&#128196;</Text>
                </View>
                <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.totalRecipes}</Text>
                <Text style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Recipes</Text>
              </View>
              <View style={{ width: 'calc(50% - 6px)', backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '16px', alignItems: 'center' }}>
                <View style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <Text style={{ fontSize: '18px' }}>&#128065;</Text>
                </View>
                <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.totalViews}</Text>
                <Text style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Total Views</Text>
              </View>
              <View style={{ width: 'calc(50% - 6px)', backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '16px', alignItems: 'center' }}>
                <View style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#FCE4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <Text style={{ fontSize: '18px' }}>&#10084;</Text>
                </View>
                <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.totalLikes}</Text>
                <Text style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Total Likes</Text>
              </View>
              <View style={{ width: 'calc(50% - 6px)', backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '16px', alignItems: 'center' }}>
                <View style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <Text style={{ fontSize: '18px' }}>&#128101;</Text>
                </View>
                <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.totalFollowers}</Text>
                <Text style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Followers</Text>
              </View>
            </View>
          </View>

          <View style={{ margin: '16px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Trending Recipes</Text>
            {stats.trendingRecipes.length === 0 ? (
              <View style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '24px', alignItems: 'center' }}>
                <Text style={{ fontSize: '14px', color: '#999' }}>No recipes yet</Text>
              </View>
            ) : (
              <View>
                {stats.trendingRecipes.map((recipe, index) => (
                  <View
                    key={recipe.id}
                    onClick={() => Taro.navigateTo({ url: `/pages/recipe-detail/index?id=${recipe.id}` })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '12px',
                      marginBottom: '8px'
                    }}
                  >
                    <Text style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-primary)', marginRight: '12px' }}>#{index + 1}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>{recipe.title}</Text>
                      <View style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <Text style={{ fontSize: '12px', color: '#999' }}>{recipe.views} views</Text>
                        <Text style={{ fontSize: '12px', color: '#999' }}>&#8226;</Text>
                        <Text style={{ fontSize: '12px', color: '#999' }}>{recipe.likes || 0} likes</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: '18px', color: '#999' }}>&rsaquo;</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={{ margin: '16px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Tips</Text>
            <View style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '16px' }}>
              <View style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                <Text style={{ fontSize: '16px', marginRight: '8px' }}>&#8505;</Text>
                <Text style={{ fontSize: '14px', color: 'var(--color-muted)', flex: 1 }}>Add high-quality photos to increase engagement by 40%</Text>
              </View>
              <View style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                <Text style={{ fontSize: '16px', marginRight: '8px' }}>&#8505;</Text>
                <Text style={{ fontSize: '14px', color: 'var(--color-muted)', flex: 1 }}>Post recipes during peak hours (6-9 PM) for more visibility</Text>
              </View>
              <View style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: '16px', marginRight: '8px' }}>&#8505;</Text>
                <Text style={{ fontSize: '14px', color: 'var(--color-muted)', flex: 1 }}>Use popular categories to reach more users</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
