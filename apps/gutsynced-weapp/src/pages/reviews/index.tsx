import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
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

export default class Reviews extends Component<{}, { reviews: any[]; recipeId: string; loading: boolean }> {
  state = { reviews: [] as any[], recipeId: '', loading: true }

  async componentDidMount() {
    const recipeId = (Taro.getCurrentInstance().router?.params?.id as string) || ''
    this.setState({ recipeId })
    if (recipeId) {
      await this.loadReviews(recipeId)
    }
  }

  loadReviews = async (recipeId: string) => {
    try {
      const recipe = await request({ url: `/api/recipes/${recipeId}` })
      this.setState({ reviews: recipe?.reviews || [], loading: false })
    } catch (err) {
      console.error('Failed to load reviews:', err)
      this.setState({ loading: false })
    }
  }

  handleAddReview = () => {
    const { recipeId } = this.state
    Taro.navigateTo({ url: `/pages/add-reviews/index?id=${recipeId}` })
  }

  render() {
    const { reviews, loading } = this.state
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0'

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={() => Taro.navigateBack()}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Reviews</Text>
          <Text style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: '600' }} onClick={this.handleAddReview}>Write</Text>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          <View style={{ padding: '16px' }}>
            <View style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '16px', marginBottom: '16px', alignItems: 'center' }}>
              <Text style={{ fontSize: '36px', fontWeight: '600', color: 'var(--color-text)' }}>{avgRating}</Text>
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>{reviews.length} reviews</Text>
            </View>

            {loading ? (
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', padding: '20px' }}>Loading...</Text>
            ) : reviews.length === 0 ? (
              <Text style={{ fontSize: '14px', color: 'var(--color-muted)', textAlign: 'center', padding: '20px' }}>No reviews yet. Be the first!</Text>
            ) : (
              reviews.map((rev: any) => (
                <View key={rev.id} style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '12px', marginBottom: '8px' }}>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '6px' }}>
                    <View style={{ width: '32px', height: '32px', borderRadius: '16px', backgroundColor: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
                      <Text style={{ color: '#FFFFFF', fontSize: '14px' }}>{(rev.user?.name || 'U')[0]}</Text>
                    </View>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>{rev.user?.name || 'User'}</Text>
                    <View style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'row' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Text key={i} style={{ fontSize: '14px', color: i < rev.rating ? '#FBBF24' : '#D1D1D6' }}>*</Text>
                      ))}
                    </View>
                  </View>
                  <Text style={{ fontSize: '14px', color: 'var(--color-text)' }}>{rev.text}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}
